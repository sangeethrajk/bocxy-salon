import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { NavController, LoadingController, ModalController, AlertController } from '@ionic/angular';
import { Location, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tab3Servcie } from './tab3.service';
import { AppointmentBooking } from './tab3Booking.model';
import { Stylist } from './stylist.model';
import { TimeSlot } from './timeSlot.model';
import { MerchantService } from './merchantService.model';
import { ToastService } from '../_services/toast.service';
import { SharedService } from '../_services/shared.service';
import { AppointmentServicePage } from '../appointmentservice/appointmentservice.page';
import { Time } from './tab3.model';
import { database } from 'firebase';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  providers: [Keyboard]
})

export class Tab3Page implements OnInit {
  @ViewChild('ngTelInput')
  ngTelInput: ElementRef;
  isKeyboardHide = true;
  selectedIndex: any;
  selectedTimeIndex: any;
  stylistButtonColor = '';
  appointmentForm: FormGroup;
  contactNumber: number;
  dialCode: string;
  countryCode = 'in';
  telInputOptions = { initialCountry: 'in', onlyCountries: ['in'] };
  datebuttons: { date: string, name: string }[];
  appointmentBooking: AppointmentBooking;
  stylists: Stylist[];
  selectedStylistIndex: number;
  timeslots: TimeSlot[];
  formSubmitted: boolean;
  merchantServiceList: MerchantService[];
  isPickDateError: boolean;
  isStylistError: boolean;
  isSlotSelectionError: boolean;
  disableBookingBtn: boolean;
  slotDuration: number;
  storeDuration: any;
  serviceCost: number;
  emptySlotDuration: boolean;
  emptyStylist: boolean;
  refreshSubscription = new Subject();
  constructor(
    public modalController: ModalController,
    public keyboard: Keyboard,
    public navCtrl: NavController,
    private location: Location,
    private formBuilder: FormBuilder,
    private tab3Service: Tab3Servcie,
    private loadingCtrl: LoadingController,
    private toast: ToastService,
    private sharedService: SharedService,
    private nh: NavigationHandler
  ) {
  }

  ngOnInit() {
    this.appointmentForm = this.formBuilder.group({
      userName: [null, Validators.compose([Validators.required])],
      contactNumber: [null, Validators.compose([Validators.required])],
      service: [{ value: null, disabled: true }, Validators.compose([Validators.required])]
    });
    this.sharedService.currentAppointmentBookingDateRefresh.pipe(takeUntil(this.refreshSubscription)).subscribe(async data => {
      this.getAppointmentDates();
      this.clearNullValues();
    });
    this.appointmentBooking = new AppointmentBooking();
    this.disableBookingBtn = false;
  }

  OnDateSelect(dateString, index) {
    this.isPickDateError = false;
    // if (this.selectedIndex !== index) {
    this.selectedIndex = index;
    const date = new Date(dateString);
    this.appointmentBooking.bookingDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    this.tab3Service.GetDateSlots(this.appointmentBooking.merchantStoreServiceId, this.appointmentBooking.bookingDate).subscribe(
      async (response) => {
        loading.then(l => l.dismiss());
        if (response.status === 'SUCCESS') {
          if (response.data.stylists && response.data.stylists.length > 0) {
            this.storeDuration = { openingTime: response.data.openingTime, closingTime: response.data.closingTime };
            this.emptyStylist = false;
            this.stylists = response.data.stylists;
            // this.stylists.unshift({ professionistAccountId: 0, firstName: 'Any' });
            this.generateSlots();
            // if (this.appointmentBooking.stylistAccountId != null) {
            //   this.OnStylistSelect(this.appointmentBooking.stylistAccountId, this.selectedStylistIndex);
            // }
            this.selectedStylistIndex = null;
            this.appointmentBooking.stylistAccountId = null;
            this.selectedTimeIndex = null;
            this.appointmentBooking.slotStartTime = null;
            this.appointmentBooking.slotEndTime = null;
          }
          else {
            this.stylists = [];
            this.emptyStylist = true;
            this.emptySlotDuration = false;
          }
        }
        else {
          this.toast.showToast('Something went wrong, Please try again');
        }
      }
    );
    this.clearTimeSelect();
    // }
  }

  OnStylistSelect(stylistId, i) {
    this.isStylistError = false;
    // if (this.selectedStylistIndex !== i) {
    this.selectedStylistIndex = i;
    this.appointmentBooking.stylistAccountId = stylistId;
    const loading = this.loadingCtrl.create();

    loading.then(l => l.present());
    const stylistSlots = this.tab3Service.GetStylistSlots(
      this.appointmentBooking.stylistAccountId,
      this.appointmentBooking.bookingDate
    ).subscribe(
      async (response) => {
        loading.then(l => l.dismiss());
        if (response.status === 'SUCCESS') {
          const data = response.data;
          this.clearTimeSelect();
          const slotDurationSeconds = this.slotDuration * 60;
          for (const stylistSlot of data.bookedSlots) {
            const stylistStart = new Time(stylistSlot.slotStartTime);
            const stylistEnd = new Time(stylistSlot.slotEndTime);
            const stylistStartSeconds = stylistStart.getTotalSeconds();
            const stylistEndSeconds = stylistEnd.getTotalSeconds();
            for (const slot of this.timeslots) {
              if (!slot.isDisabled) {
                const slotTime = new Time(slot.slotName);
                const slotSeconds = slotTime.getTotalSeconds();
                const startDifference = stylistStartSeconds - slotSeconds;
                if (startDifference === 0 || (startDifference > 0 && startDifference < slotDurationSeconds)) {
                  slot.isDisabled = true;
                }
                else if ((slotTime.isGreaterThan(stylistStart) || slotTime.isEqual(stylistStart)) && slotTime.isLessThan(stylistEnd)) {
                  slot.isDisabled = true;
                }
                else {
                  slot.isDisabled = false;
                }
              }
            }
          }

          const date = new Date();
          const currentDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
          let datePipe = new DatePipe('en-US');
          const currentTime = datePipe.transform(date, 'H:mm:ss');
          if (data.bookedSlots.length === 0) {
            for (const slot of this.timeslots) {
              if (this.appointmentBooking.bookingDate === currentDate && new Time(slot.slotName).isLessThan(new Time(currentTime))) {
                slot.isDisabled = true;
              }
              else {
                slot.isDisabled = false;
              }
            }
          }
          else {
            for (const slot of this.timeslots) {
              if (this.appointmentBooking.bookingDate === currentDate && new Time(slot.slotName).isLessThan(new Time(currentTime))) {
                slot.isDisabled = true;
              }
            }
          }

          if (data.availability && data.availability.length > 0) {
            const selectedSlots = [];
            for (const ava of data.availability) {
              const startTime = new Time(ava.startTime);
              const endTime = new Time(ava.endTime);
              for (const slot of this.timeslots) {
                const slotTime = new Time(slot.slotName);
                if (slotTime.isEqual(startTime) || (slotTime.isGreaterThan(startTime) && slotTime.isLessThan(endTime))) {
                  selectedSlots.push(slot.slotName);
                }
              }
            }

            for (const slot of this.timeslots) {
              let isSelectedSlot = false;
              if (slot.isDisabled === null || slot.isDisabled === false) {
                for (const ava of selectedSlots) {
                  if (slot.slotName === ava) {
                    isSelectedSlot = true;
                    break;
                  }
                }
                if (isSelectedSlot === false) {
                  slot.isDisabled = true;
                }
              }
            }
          }
        }
        else {
          this.toast.showToast('Something went wrong, Please try again');
        }
      }
    );
    // }
  }
  clearTimeSelect() {
    this.selectedTimeIndex = -1;
    this.appointmentBooking.slotStartTime = null;
    this.appointmentBooking.slotEndTime = null;
  }

  OnTimeSlotSelect(slotTime, index) {
    this.isSlotSelectionError = false;
    this.selectedTimeIndex = index;
    const startTime = new Time(slotTime);
    this.appointmentBooking.slotStartTime = startTime.toString();
    this.appointmentBooking.slotEndTime = startTime.addMinutes(this.slotDuration).subtractSeconds(1).toString();
  }

  ionViewWillEnter() {
    this.keyboard.onKeyboardWillShow().subscribe(() => {
      this.isKeyboardHide = false;
      // console.log('SHOWK');
    });

    this.keyboard.onKeyboardWillHide().subscribe(() => {
      this.isKeyboardHide = true;
      // console.log('HIDEK');
    });
  }

  async showBookingConfirmation(message = null, value = null) {
    const price = value ? value : this.serviceCost;
    this.OnBooking(price);
    // const alert = await this.alertController.create({
    //   cssClass: 'my-custom-class',
    //   header: 'Confirm Booking',
    //   subHeader: 'Service cost',
    //   message: message,
    //   inputs: [{
    //     name: 'price',
    //     label: 'Service Cost',
    //     placeholder: 'Service cost',
    //     value: price,
    //     type: 'number',
    //     min: 1,
    //     max: 999999999
    //   }],
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       handler: (no) => {
    //         console.log('Booking Canceled!');
    //       },
    //     },
    //     {
    //       text: 'Book Now',
    //       role: 'yes',
    //       cssClass: 'secondary',
    //       handler: async (data) => {
    //         price = data.price;
    //         if (price && price > 0) {
    //           this.OnBooking(price);
    //           alert.dismiss(true);
    //           return true;
    //         }
    //         else {
    //           alert.dismiss(false);
    //           return false;
    //         }
    //       },
    //     },
    //   ]
    // });
    // await alert.present();
    // alert.onDidDismiss().then(async (data) => {
    //   if (data.role !== 'cancel' && (!data.data.values.price || data.data.values.price <= 0)) {
    //     await this.showBookingConfirmation('Please enter valid servcie cost', data.data.values.price);
    //   }
    // });
  }

  OnBooking(manualPrice: number) {
    this.disableBookingBtn = true;
    this.formSubmitted = true;
    if (this.appointmentForm.valid && this.ValidateAppointmentForm()) {
      this.appointmentBooking.customerName = this.appointmentForm.value.userName.trim();
      this.appointmentBooking.customerMobile = this.appointmentForm.value.contactNumber;
      this.appointmentBooking.customerMobileCountry = this.countryCode.toUpperCase();
      this.appointmentBooking.customerMobileCode = this.dialCode;
      this.appointmentBooking.stylistAccountId = this.appointmentBooking.stylistAccountId === 0 ? null :
        this.appointmentBooking.stylistAccountId;
      this.appointmentBooking.type = 'WALKIN';
      this.appointmentBooking.manualPrice = manualPrice;
      const loading = this.loadingCtrl.create();
      loading.then(l => l.present());
      this.tab3Service.BookAppointment(this.appointmentBooking).subscribe(
        (response) => {
          loading.then(l => l.dismiss());
          if (response && response.status === 'SUCCESS') {
            if (response.data.bookedFlag) {
              this.datebuttons.push();
              this.appointmentBooking.slotStartTime = null;
              this.appointmentBooking.slotEndTime = null;
              this.selectedTimeIndex = null;
              if (!this.appointmentBooking.stylistAccountId) {
                this.appointmentBooking.stylistAccountId = 0;
              }
              this.OnDateSelect(this.appointmentBooking.bookingDate, this.selectedIndex);
              this.toast.showToast('Selected Slot is already booked. Please select other slot.');
              this.disableBookingBtn = false;
            }
            else {
              this.sharedService.changeAppointmentMannualRefresh(1);
              this.toast.showToast('Appointment booked');
              this.nh.GoBackTo('/home/tabs/tab1');
              this.formSubmitted = false;
              this.disableBookingBtn = false;
              this.appointmentBooking = new AppointmentBooking();
              this.appointmentForm.get('userName').setValue(null);
              this.appointmentForm.get('contactNumber').setValue(null);
              this.appointmentForm.get('service').setValue(null);
              this.selectedIndex = null;
              this.selectedStylistIndex = null;
              this.selectedTimeIndex = null;
            }
          }
          else {
            this.toast.showToast('Something went wrong, Please try again');
            this.disableBookingBtn = false;
          }
        }
      );


    }
    else {
      this.disableBookingBtn = false;
    }

  }

  userNameValidate(event) {
    // tslint:disable-next-line: deprecation
    const theEvent = event || window.event;
    let key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    const regex = /^[a-zA-Z_ ]*$/i;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) {
        theEvent.preventDefault();
      }
    }
  }

  hasError(obj) {
    if (!this.appointmentForm.get('contactNumber').getError('required')) {
      if (!obj) {
        this.appointmentForm.get('contactNumber').setErrors({ invalid_cell_phone: true });
      }
    }
  }

  getNumber(obj) {
    this.contactNumber = this.appointmentForm.value.contactNumber ?
      typeof (this.appointmentForm.value.contactNumber) === 'number' ? this.appointmentForm.value.contactNumber :
        Number((this.appointmentForm.value.contactNumber).replace(' ', '')) : null;
    // this.contactNumber = Number(this.appointmentForm.value.contactNumber);
    const n = obj.indexOf(this.contactNumber);
    this.dialCode = obj.substr(0, n);
  }

  onCountryChange(obj) {
    this.countryCode = obj.iso2;
  }

  telInputObject(obj) {
    obj.setCountry(this.countryCode);
  }

  numberValidate(evt) {
    // tslint:disable-next-line: deprecation
    const theEvent = evt || window.event;
    let key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    const regex = /[0-9]/;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) {
        theEvent.preventDefault();
      }
    }
  }

  changePhone() {
    this.ngTelInput.nativeElement.blur();
    this.ngTelInput.nativeElement.focus();
  }

  previous() {
    this.location.back();
    this.formSubmitted = false;
    this.disableBookingBtn = false;
    this.appointmentBooking = new AppointmentBooking();
    this.appointmentForm.get('userName').setValue(null);
    this.appointmentForm.get('contactNumber').setValue(null);
    this.appointmentForm.get('service').setValue(null);
    this.selectedIndex = null;
    this.selectedStylistIndex = null;
    this.selectedTimeIndex = null;
  }

  async showMerchantServiceModal() {
    const modal = await this.modalController.create({
      component: AppointmentServicePage,
      cssClass: 'my-custom-class',
    });
    modal.onWillDismiss().then(response => {
      if (response.data) {
        const service = (response.data) as MerchantService;
        this.appointmentBooking.merchantStoreServiceId = service.merchantStoreServiceId;
        this.appointmentForm.get('service').setValue(service.name);
        this.onServiceChange(service.merchantStoreServiceId);
      }
    });
    return await modal.present();
  }

  getAppointmentDates() {
    this.tab3Service.GetAppointmentDate().subscribe(
      async (response) => {
        if (response.status === 'SUCCESS') {
          this.datebuttons = [];
          for (const dateString of response.data) {
            const date = new Date(dateString);
            this.datebuttons.push({ date: dateString, name: date.toLocaleString('en-IN', { day: 'numeric', month: 'short' }) });
          }
        }
        else {
          this.toast.showToast('Something went wrong, Please try again');
        }
      }
    );
  }

  getStylistList() {
    this.tab3Service.GetStylistList().subscribe(
      async (response) => {
        if (response.status === 'SUCCESS') {
          this.stylists = response.data;
          // this.stylists.unshift({ professionistAccountId: 0, firstName: 'Any' });
        }
        else {
          this.toast.showToast('Something went wrong, Please try again');
        }
      }
    );
  }

  ValidateAppointmentForm(): boolean {
    if (!this.appointmentBooking.bookingDate) {
      this.isPickDateError = true;
      return false;
    }
    if (!this.appointmentBooking.stylistAccountId && this.appointmentBooking.stylistAccountId !== 0) {
      this.isStylistError = true;
      return false;
    }
    if (!this.appointmentBooking.slotStartTime) {
      this.isSlotSelectionError = true;
      return false;
    }

    return true;
  }

  onServiceChange(id: number) {
    if (id) {
      this.tab3Service.GetStylistByService(id).subscribe(
        async (response) => {
          if (response.status === 'SUCCESS') {

            this.emptyStylist = false;
            // this.stylists = response.data.stylists;
            // this.stylists.unshift({ professionistAccountId: 0, firstName: 'Any' });
            this.slotDuration = response.data.slotDuration;
            if (!this.slotDuration || this.slotDuration === 0) {
              this.emptySlotDuration = true;
            }
            else {
              this.emptySlotDuration = false;
            }
            this.serviceCost = response.data.price;
            this.selectedStylistIndex = null;
            this.appointmentBooking.stylistAccountId = null;
            this.selectedTimeIndex = null;
            this.appointmentBooking.slotStartTime = null;
            this.appointmentBooking.slotEndTime = null;
            this.generateSlots();


          }
          else {
            this.toast.showToast('Something went wrong, Please try again');
          }
        }
      );
    }
  }
  clearNullValues() {
    this.formSubmitted = false;
    this.disableBookingBtn = false;
    this.appointmentBooking = new AppointmentBooking();
    if (this.appointmentForm) {
      this.appointmentForm.get('userName').setValue(null);
      this.appointmentForm.get('contactNumber').setValue(null);
      this.appointmentForm.get('service').setValue(null);
    }
    this.selectedIndex = null;
    this.selectedStylistIndex = null;
    this.selectedTimeIndex = null;
  }
  generateSlots() {
    if (this.storeDuration && this.slotDuration && this.slotDuration > 0) {
      const openTime = new Time(this.storeDuration.openingTime);
      const closeTime = new Time(this.storeDuration.closingTime);
      const iteration = (closeTime.getTotalMinutes() - openTime.getTotalMinutes()) / this.slotDuration;
      const tempTime = openTime;
      this.timeslots = [];

      this.timeslots.push({ slotName: tempTime.toShortTimeString() });
      for (let i = 1; i < iteration; i++) {
        this.timeslots.push({ slotName: tempTime.addMinutes(this.slotDuration).toShortTimeString() });
      }
    }
  }

  ngOnDestroy() {
    this.refreshSubscription.next();
    this.refreshSubscription.unsubscribe();
  }
}

