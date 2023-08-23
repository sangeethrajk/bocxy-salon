import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, LoadingController, ModalController, AlertController } from '@ionic/angular';
import { ToastService } from '../_services/toast.service';
import { SharedService } from '../_services/shared.service';
import { AppointmentServicePage } from '../appointmentservice/appointmentservice.page';
import { MerchantService, Stylist, AppointmentBooking, TimeSlot } from './specialbooking.model';
import { SpecialBookingService } from './specialbooking.service';
import { Time } from '../_models/Time.model';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-specialbooking',
  templateUrl: './specialbooking.page.html',
  styleUrls: ['./specialbooking.page.scss'],
  providers: [Keyboard]
})
export class SpecialbookingPage implements OnInit, OnDestroy {
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
  minFilterDate: string;
  maxFilterDate: string;
  serviceCost: number;
  emptyStylist: boolean;
  refreshSubscription = new Subject();
  constructor(
    public modalController: ModalController,
    public keyboard: Keyboard,
    public navCtrl: NavController,
    private location: Location,
    private formBuilder: FormBuilder,
    private httpService: SpecialBookingService,
    private loadingCtrl: LoadingController,
    private toast: ToastService,
    private sharedService: SharedService,
    private nav: NavigationHandler,
    private alertController: AlertController
  ) {
  }

  ngOnInit() {
    this.sharedService.currentAppointmentBookingDateRefresh.pipe(takeUntil(this.refreshSubscription)).subscribe(async data => {
      this.getAppointmentDates();
    });
    this.appointmentForm = this.formBuilder.group({
      userName: [null, Validators.compose([Validators.required])],
      contactNumber: [null, Validators.compose([Validators.required])],
      service: [{ value: null, disabled: true }, Validators.compose([Validators.required])]
    });

    // this.getAppointmentDates();
    this.appointmentBooking = new AppointmentBooking();
    this.disableBookingBtn = false;
  }

  OnDateSelect(dateString, callType = 'default') {
    this.isPickDateError = false;
    if (callType === 'default') {
      const date = this.dateTimeObjFromIonDateTime(dateString);
      this.appointmentBooking.bookingDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    }
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    this.httpService.GetDateSlots(this.appointmentBooking.merchantStoreServiceId, this.appointmentBooking.bookingDate).subscribe(
      async (response) => {
        loading.then(l => l.dismiss());
        if (response.status === 'SUCCESS') {
          if (response.data.stylists && response.data.stylists.length > 0) {
            // this.storeDuration = { 'openingTime': response.data.openingTime, 'closingTime': response.data.closingTime };
            this.stylists = response.data.stylists;
            this.emptyStylist = false;
            // this.stylists.unshift({ professionistAccountId: 0, firstName: 'Any' });
            // this.generateSlots();
            if (this.appointmentBooking.stylistAccountId != null) {
              this.OnStylistSelect(this.appointmentBooking.stylistAccountId, this.selectedStylistIndex);
            }
            this.selectedStylistIndex = null;
            this.appointmentBooking.stylistAccountId = null;
            this.selectedTimeIndex = null;
            this.appointmentBooking.slotStartTime = null;
            this.appointmentBooking.slotEndTime = null;
          }
          else {

            this.stylists = [];
            this.emptyStylist = true;
          }
        }
        else {
          this.toast.showToast('Something went wrong, Please try again');
        }
      }
    );
  }

  OnStylistSelect(stylistId, i) {
    this.isStylistError = false;
    this.selectedStylistIndex = i;
    this.appointmentBooking.stylistAccountId = stylistId;
  }

  OnTimeSlotSelect(time) {
    const timeSplit = time.split('T')[1].split('+')[0].split(':');
    const slotTime = timeSplit[0] + ':' + timeSplit[1];
    console.log(slotTime);
    const slotStartTime = new Time(slotTime);
    console.log(slotStartTime);
    this.isSlotSelectionError = false;
    this.appointmentBooking.slotStartTime = slotStartTime.toString();
    this.appointmentBooking.slotEndTime = slotStartTime.addMinutes(this.slotDuration).subtractSeconds(1).toString();
    console.log(slotStartTime.toString());
    console.log(slotStartTime.addMinutes(this.slotDuration).subtractSeconds(1).toString());
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
    let price = value ? value : this.serviceCost;
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm Booking',
      subHeader: 'Service cost',
      message,
      inputs: [{
        name: 'price',
        label: 'Service Cost',
        placeholder: 'Service cost',
        value: price,
        type: 'number',
        min: 1,
        max: 999999999
      }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (no) => {
            console.log('Booking Canceled!');
          },
        },
        {
          text: 'Book Now',
          role: 'yes',
          cssClass: 'secondary',
          handler: async (data) => {
            price = data.price;
            if (price && price > 0) {
              this.OnBooking(price);
              alert.dismiss(true);
              return true;
            }
            else {

              alert.dismiss(false);
              return false;
            }
          },
        },
      ]
    });
    await alert.present();
    alert.onDidDismiss().then(async (data) => {
      if (data.role !== 'cancel' && (!data.data.values.price || data.data.values.price <= 0)) {
        await this.showBookingConfirmation('Please enter valid servcie cost', data.data.values.price);
      }
    });
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
      this.appointmentBooking.type = 'SPECIAL';
      this.appointmentBooking.manualPrice = manualPrice;
      const loading = this.loadingCtrl.create();
      loading.then(l => l.present());
      this.httpService.BookAppointment(this.appointmentBooking).subscribe(
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
              this.OnDateSelect(this.appointmentBooking.bookingDate);
              this.toast.showToast('Selected Slot is already booked. Please select other slot.');
              this.disableBookingBtn = false;
            }
            else {
              this.sharedService.changeAppointmentMannualRefresh(1);
              this.toast.showToast('Appointment booked');
              this.navCtrl.navigateRoot('/home/tabs/tab1');
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

  goBack(url: string) {
    this.nav.GoBackTo(url);
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
        if (this.appointmentBooking.bookingDate) {
          this.OnDateSelect(this.appointmentBooking.bookingDate, 'force');
        }
      }
    });
    return await modal.present();
  }

  getAppointmentDates() {
    this.httpService.GetAppointmentDate().subscribe(
      async (response) => {
        if (response.status === 'SUCCESS') {
          this.minFilterDate = response.data[0];
          this.maxFilterDate = response.data[response.data.length - 1];
        }
        else {
          this.toast.showToast('Something went wrong, Please try again');
        }
      }
    );
  }

  getStylistList() {
    this.httpService.GetStylistList().subscribe(
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
      this.httpService.GetStylistByService(id).subscribe(
        async (response) => {
          if (response.status === 'SUCCESS') {
            // this.stylists = response.data.stylists;
            // this.stylists.unshift({ professionistAccountId: 0, firstName: 'Any' });
            this.slotDuration = response.data.slotDuration;
            this.serviceCost = response.data.price;
          }
          else {
            this.toast.showToast('Something went wrong, Please try again');
          }
        }
      );
    }
  }
  // convert mysql datetime to js date obj
  dateTimeObjFromMysqlDateTime(str: string) {
    if (str) {
      const dateTimeArr = str.split(/[- :]/);
      // tslint:disable-next-line: max-line-length
      const dateTimeObj = new Date(Number(dateTimeArr[0]), Number(dateTimeArr[1]) - 1, Number(dateTimeArr[2]), Number(dateTimeArr[3]), Number(dateTimeArr[4]), Number(dateTimeArr[5]));
      return dateTimeObj;
    } else { return null; }
  }
  // convert mysql time to js date obj
  dateTimeObjFromMysqlTime(str: string) {
    if (str) {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
      const yyyy = today.getFullYear();
      const time = yyyy + '-' + mm + '-' + dd + ' ' + str;
      const timeArr = time.split(/[- :]/);
      // tslint:disable-next-line: max-line-length
      const timeObj = new Date(Number(timeArr[0]), Number(timeArr[1]) - 1, Number(timeArr[2]), Number(timeArr[3]), Number(timeArr[4]), Number(timeArr[5]));
      return timeObj;
    } else { return null; }
  }
  // convert html input date/time to js date obj
  dateTimeObjFromIonDateTime(str: string) {
    if (str) {
      const dateTimeStr = (str.split(/[\.\+]/)[0]).split('T')[0] + ' ' + (str.split(/[\.\+]/)[0]).split('T')[1];
      const dateTimeArr = dateTimeStr.split(/[- :]/);
      // tslint:disable-next-line: max-line-length
      const dateTimeObj = new Date(Number(dateTimeArr[0]), Number(dateTimeArr[1]) - 1, Number(dateTimeArr[2]), Number(dateTimeArr[3]), Number(dateTimeArr[4]), Number(dateTimeArr[5]));
      return dateTimeObj;
    } else { return null; }
  }
  // set html input time
  getDateTimeFromTime(time: string): string {
    const dateTime = new Date();
    const timeSplit = time.split(':');
    dateTime.setHours(timeSplit[0] as unknown as number);
    dateTime.setMinutes(timeSplit[1] as unknown as number);
    // tslint:disable-next-line: max-line-length
    return dateTime.getFullYear() + '-' + this.twoDigits(1 + dateTime.getMonth()) + '-' + this.twoDigits(dateTime.getDate()) + 'T' + this.twoDigits(dateTime.getHours()) + ':' + this.twoDigits(dateTime.getMinutes()) + ':' + this.twoDigits(dateTime.getSeconds()) + '+05:30';
  }
  twoDigits(d) {
    if (0 <= d && d < 10) { return '0' + d.toString(); }
    if (-10 < d && d < 0) { return '-0' + (-1 * d).toString(); }
    return d.toString();
  }

  convertTime(datetime) {
    const dateTimeObj = this.dateTimeObjFromIonDateTime(datetime);
    const hours = dateTimeObj.getHours();
    const minutes = dateTimeObj.getMinutes();
    // hours = hours % 12;
    // hours = hours ? hours : 12; // the hour '0' should be '12'
    // minutes = minutes < 10 ? '0'+minutes : minutes;
    const strTime = hours + ':' + minutes + ':00';
    return strTime;
  }
  ngOnDestroy() {
    this.refreshSubscription.next();
    this.refreshSubscription.unsubscribe();
  }

}
