import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { NavController, LoadingController } from '@ionic/angular';
import { Location, DatePipe } from '@angular/common';
import { BookAppointmentService } from './bookappointment.service';
import { ToastService } from '../_services/toast.service';
import { TimeSlot, Stylist, Appointment, Time } from './bookappointment.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NavigationHandler } from '../_services/navigation-handler.service';

@Component({
  selector: 'app-bookappointment',
  templateUrl: './bookappointment.page.html',
  styleUrls: ['./bookappointment.page.scss'],
  providers: [Keyboard]
})
export class BookappointmentPage implements OnInit {
  isKeyboardHide = true;
  selectedIndex: any;
  selectedTimeIndex: any;
  selectedStylistIndex: any;
  stylistButtonColor = 'light';
  merchantStoreServiceId: number;
  paramSubscription: Subscription;
  datebuttons: { date: string, name: string }[];
  stylists: Stylist[];
  timeslot: TimeSlot[];
  appointment: Appointment;
  merchantStoreService: any;
  isDateError: boolean;
  isStylistError: boolean;
  isTimeSlotError: boolean;
  isSubmitted: boolean;
  disableBookButton: boolean;
  slotDuration: number;
  storeDuration: any;
  selectedStylist: Stylist;
  selectedSlotDuration: string;
  selectedDate: string;
  emptyDaySlots: boolean;
  emptyStylist: boolean;
  constructor(
    public keyboard: Keyboard,
    public navCtrl: NavController,
    private location: Location,
    private httpService: BookAppointmentService,
    private toast: ToastService,
    public route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    public router: Router,
    private nav: NavigationHandler,
  ) { }

  async ngOnInit() {
    this.selectedIndex = null;
    this.isDateError = false;
    this.isStylistError = false;
    this.isTimeSlotError = false;
    this.isSubmitted = false;
    this.disableBookButton = false;
    this.emptyDaySlots = false;
    this.merchantStoreService = {};
    this.stylists = [];
    this.selectedStylist = new Stylist();
    this.paramSubscription = this.route.params.subscribe(
      async (params: Params) => {
        // tslint:disable-next-line: no-string-literal
        if (params['merchantStoreServiceId']) {
          if (!this.appointment) {
            this.appointment = new Appointment();
            this.appointment.type = 'BOOKING';
            this.merchantStoreServiceId = params.merchantStoreServiceId;
            this.appointment.merchantStoreServiceId = this.merchantStoreServiceId;
            await this.getMerchantStoreSerivceDetails();
            await this.getAppointmentDate();
            await this.getStylist();
          }
        }
      });
  }


  async OnAppointmentDateSelect(date: any, index) {
    this.isDateError = false;
    this.selectedIndex = index;
    this.appointment.bookingDate = date.date;
    this.selectedDate = date.name;
    this.stylists = [];
    this.appointment.stylistAccountId = null;
    this.selectedStylistIndex = null;
    this.isStylistError = false;
    this.selectedStylist = null;
    this.selectedTimeIndex = null;
    this.isTimeSlotError = false;
    this.appointment.slotStartTime = null;
    this.appointment.slotEndTime = null;
    this.selectedSlotDuration = null;
    const data = await this.getDateSlots(date.date);
    console.log('post call');
    if (data && data.openingTime && data.closingTime) {
      this.emptyDaySlots = false;
      if (data.stylists && data.stylists.length > 0) {
        this.storeDuration = { 'openingTime': data.openingTime, 'closingTime': data.closingTime };

        this.emptyStylist = false;
        this.stylists = data.stylists;
        // this.stylists.unshift({ professionistAccountId: 0, firstName: 'Any' });
        this.generateSlots();
        // if (this.appointment.stylistAccountId && this.selectedStylistIndex) {
        //   this.changeStylist(this.selectedStylist, this.selectedStylistIndex);
        // }
      }
      else {
        this.emptyStylist = true;
        this.stylists = [];
      }

    }
    else {
      this.emptyDaySlots = true;
    }


  }

  changeTimeSlot(slot: TimeSlot, index) {
    this.selectedTimeIndex = index;
    this.isTimeSlotError = false;
    const startTime = new Time(slot.slotName);
    const displayTime = new Time(slot.slotName);
    this.appointment.slotStartTime = startTime.toString();
    this.appointment.slotEndTime = startTime.addMinutes(this.slotDuration).subtractSeconds(1).toString();
    this.selectedSlotDuration = `${displayTime.toShortTimeString()} - ${displayTime.addMinutes(this.slotDuration).toShortTimeString()}`;
    //this.appointment.slotId = slot.slotId;
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

  changeStylist(stylist: Stylist, index) {
    this.selectedTimeIndex = null;
    this.isTimeSlotError = false;
    this.appointment.slotStartTime = null;
    this.appointment.slotEndTime = null;
    this.selectedSlotDuration = null;
    this.isStylistError = false;
    this.selectedStylistIndex = index;
    this.appointment.stylistAccountId = stylist.professionistAccountId;
    this.selectedStylist = stylist;
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    this.httpService.getStylistSlots(this.merchantStoreServiceId,
      stylist.professionistAccountId, this.appointment.bookingDate).pipe().subscribe(
        (response) => {
          loading.then(l => l.dismiss());
          if (response && response.status === 'SUCCESS') {
            const data = response.data;
            const slotDurationSeconds = this.slotDuration * 60;
            for (let stylistSlot of data.bookedSlots) {
              const stylistStart = new Time(stylistSlot.slotStartTime);
              const stylistEnd = new Time(stylistSlot.slotEndTime);
              const stylistStartSeconds = stylistStart.getTotalSeconds();
              const stylistEndSeconds = stylistEnd.getTotalSeconds();
              for (let slot of this.timeslot) {
                if (!slot.isDisabled) {
                  const slotTime = new Time(slot.slotName);
                  const slotSeconds = slotTime.getTotalSeconds();
                  const startDifference = stylistStartSeconds - slotSeconds;
                  if (startDifference === 0 || (startDifference > 0 && startDifference < slotDurationSeconds)) {
                    slot.isDisabled = true
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
            var datePipe = new DatePipe('en-US');
            const currentTime = datePipe.transform(date, 'H:mm:ss');
            if (data.bookedSlots.length === 0) {
              for (let slot of this.timeslot) {
                if (this.appointment.bookingDate === currentDate && new Time(slot.slotName).isLessThan(new Time(currentTime))) {
                  slot.isDisabled = true;
                }
                else {
                  slot.isDisabled = false;
                }
              }
            }
            else {
              for (let slot of this.timeslot) {
                if (this.appointment.bookingDate === currentDate && new Time(slot.slotName).isLessThan(new Time(currentTime))) {
                  slot.isDisabled = true;
                }
              }
            }

            if (data.availability && data.availability.length > 0) {
              let selectedSlots = [];
              for (const ava of data.availability) {
                const startTime = new Time(ava.startTime);
                const endTime = new Time(ava.endTime);
                for (const slot of this.timeslot) {
                  const slotTime = new Time(slot.slotName);
                  if (slotTime.isEqual(startTime) || (slotTime.isGreaterThan(startTime) && slotTime.isLessThan(endTime))) {
                    selectedSlots.push(slot.slotName);
                  }
                }
              }

              for (const slot of this.timeslot) {
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

            if (this.selectedTimeIndex && this.timeslot[this.selectedTimeIndex].isDisabled === true) {
              this.selectedTimeIndex = null;
              this.appointment.slotStartTime = null;
              this.appointment.slotEndTime = null;
              this.selectedSlotDuration = '';
            }
          }
        }
      );
  }

  getMerchantStoreSerivceDetails() {
    return new Promise((resolve, reject) => {
      const loading = this.loadingCtrl.create();
      loading.then(l => l.present());
      this.httpService.getMerchantStoreService(this.merchantStoreServiceId).pipe().subscribe(
        (response) => {
          loading.then(l => l.dismiss());
          if (response && response.status === 'SUCCESS') {
            this.merchantStoreService = response.data;
          }
          else {
            this.toast.showToast('Something went wrong. Please try again');
          }
          resolve(1);
        },
        (error) => {
          reject(1);
          this.toast.showToast('Something went wrong. Please try again');
        }
      );
    });
  }

  getAppointmentDate() {
    return new Promise((resolve, reject) => {
      const loading = this.loadingCtrl.create();
      loading.then(l => l.present());
      this.httpService.getAppointmentDate(this.merchantStoreServiceId).pipe().subscribe((response) => {
        loading.then(l => l.dismiss());
        if (response && response.status === 'SUCCESS') {
          this.datebuttons = [];
          for (const dateString of response.data) {
            const date = new Date(dateString);
            this.datebuttons.push({ date: dateString, name: date.toLocaleString('en-IN', { day: 'numeric', month: 'short' }) });
          }
        }
        else {
          this.toast.showToast('Something went wrong. Please try again');
        }
        resolve(1);
      },
        (error) => {
          reject(1);
          this.toast.showToast('Something went wrong. Please try again');
        });
    });
  }

  async getDateSlots(date: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const loading = this.loadingCtrl.create();
      loading.then(l => l.present());
      this.httpService.getDateSlots(date, this.merchantStoreServiceId).pipe().subscribe((response) => {
        loading.then(l => l.dismiss());
        if (response && response.status === 'SUCCESS') {
          console.log('call');
          resolve(response.data);
        }
        else {
          this.toast.showToast('Something went wrong. Please try again');
          resolve(null);
        }
      },
        (error) => {
          reject(1);
          this.toast.showToast('Something went wrong. Please try again');
        });

    });
  }

  getStylist() {
    return new Promise((resolve, reject) => {
      const loading = this.loadingCtrl.create();
      loading.then(l => l.present());
      this.httpService.getStylist(this.merchantStoreServiceId).pipe().subscribe(
        (response) => {
          loading.then(l => l.dismiss());
          if (response && response.status === 'SUCCESS') {
            // this.stylists = response.data.stylists;
            // this.stylists.unshift({ professionistAccountId: 0, firstName: 'Any' });
            this.slotDuration = response.data.slotDuration;


          }
          else {
            this.toast.showToast('Something went wrong. Please try again');
          }
          resolve(1);
        },
        (error) => {
          reject(1);
          this.toast.showToast('Something went wrong. Please try again');
        }
      );
    });
  }

  ValidateAppointment(): boolean {
    this.isDateError = false;
    this.isStylistError = false;
    this.isTimeSlotError = false;
    if (!this.appointment.bookingDate) {
      this.isDateError = true;
    }
    if (!this.appointment.stylistAccountId) {
      this.isStylistError = true;
    }
    if (!this.appointment.slotStartTime) {
      this.isTimeSlotError = true;
    }

    if (this.isDateError === true || this.isStylistError === true || this.isTimeSlotError === true) {
      return false;
    }
    else {
      return true;
    }
  }

  onBooking() {
    this.isSubmitted = true;
    this.disableBookButton = true;
    this.disableBookButton = false;
    if (this.ValidateAppointment()) {
      const param = { data: this.appointment };
      this.router.navigateByUrl('/paymentmode', { state: param });
    }
    else {
      this.disableBookButton = false;
    }
  }

  goBack(url: string) {
    this.nav.GoBackTo(url);
  }

  generateSlots() {
    if (this.storeDuration && this.slotDuration && this.slotDuration > 0) {
      const openTime = new Time(this.storeDuration.openingTime);
      const closeTime = new Time(this.storeDuration.closingTime);
      const iteration = (closeTime.getTotalMinutes() - openTime.getTotalMinutes()) / this.slotDuration;
      let tempTime = openTime;
      this.timeslot = [];
      this.timeslot.push({ slotName: tempTime.toShortTimeString() });
      for (let i = 1; i < iteration; i++) {
        this.timeslot.push({ slotName: tempTime.addMinutes(this.slotDuration).toShortTimeString() });
      }
    }
  }
}
