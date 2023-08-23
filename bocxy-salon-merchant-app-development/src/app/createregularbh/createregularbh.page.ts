import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SlotTimeCreateService } from '../storetimecreate/slottimecreate.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../_services/toast.service';
import { MerchantSlot } from './regularMerchantSlot.model';
import { LoadingController, AlertController } from '@ionic/angular';
import { SharedService } from '../_services/shared.service';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { Time } from '../_models/Time.model';
import { take } from 'rxjs/operators';
import { DatePicker } from '@ionic-native/date-picker/ngx';
@Component({
  selector: 'app-createregularbh',
  templateUrl: './createregularbh.page.html',
  styleUrls: ['./createregularbh.page.scss'],
})
export class CreateregularbhPage implements OnInit {
  showDetails: boolean;
  public slotFormNew: FormGroup;
  slotFormSubmitted: boolean;
  disableContinueBtn: boolean;
  isValidSlotName: boolean;
  isInvalidStartDate: boolean;
  minStartDate: string;
  maxstartDate: string;
  title: boolean;
  exist: boolean;

  constructor(
    private location: Location,
    public router: Router,
    private slotCreateService: SlotTimeCreateService,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private sharedService: SharedService,
    private nav: NavigationHandler,
    private alertController: AlertController,
    private datePicker: DatePicker
  ) {
  }
  myDate: string;
  myTime: string;
  myDateNTime: string;

  errorDay: string;
  isWeekDayError = false;
  weekDayMapping = { 1: 'Sun', 2: 'Mon', 3: 'Tue', 4: 'Wed', 5: 'Thu', 6: 'Fri', 7: 'Sat' };
  timing = [
    { day: 1, openingTime: '', closingTime: '' },
    { day: 2, openingTime: '', closingTime: '' },
    { day: 3, openingTime: '', closingTime: '' },
    { day: 4, openingTime: '', closingTime: '' },
    { day: 5, openingTime: '', closingTime: '' },
    { day: 6, openingTime: '', closingTime: '' },
    { day: 7, openingTime: '', closingTime: '' }
  ];

  /*Time-Picker*/
  showTimepicker(item, type) {
    const currentDate = new Date();
    if (this.showDetails) {
      if (item && item[type] && item[type] !== '') {
        const time = new Time(item[type]);
        currentDate.setHours(time.Hour);
        currentDate.setMinutes(time.Minutes);
      }
    }
    else {
      if (type === 'openingTime') {
        const time = new Time(this.slotFormNew.get('openTime').value);
        currentDate.setHours(time.Hour);
        currentDate.setMinutes(time.Minutes);
      }
      else if (type === 'closingTime') {
        const time = new Time(this.slotFormNew.get('closeTime').value);
        currentDate.setHours(time.Hour);
        currentDate.setMinutes(time.Minutes);
      }
    }
    this.datePicker.show({
      date: currentDate,
      mode: 'time',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      okText: 'Save Time',
      // nowText: "Set Now",
      is24Hour: false
    }).then(
      time => {
        const selectedTime = ('0' + time.getHours()).slice(-2) + ':' + ('0' + time.getMinutes()).slice(-2) + ':00';
        if (this.showDetails) {
          this.weekDaysTimeChange(item, type, selectedTime);
        }
        else {
          if (type === 'openingTime') {
            this.slotFormNew.get('openTime').setValue(selectedTime);

          }
          else {
            this.slotFormNew.get('closeTime').setValue(selectedTime);
          }
        }
      },
      err => console.log('Error occurred while getting time: ', err)
    );
  }

  ngOnInit() {
    this.configStartDate();
    const startDate = new Date();
    // startDate.setDate(startDate.getDate() + 31);
    this.slotFormNew = this.formBuilder.group({
      name: [null, Validators.compose([Validators.required]),
        this.isSlotNameunique.bind(this)],
      startDate: [startDate.toISOString(), Validators.compose([
        Validators.required
      ])],
      openTime: [null, Validators.compose([
        Validators.required
      ])],
      closeTime: [null, Validators.compose([
        Validators.required
      ])]
    });

    this.disableContinueBtn = false;
    this.isValidSlotName = false;
  }
  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  configStartDate() {
    const minDate = new Date();
    this.minStartDate = this.getShortDateString(minDate);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 365);
    this.maxstartDate = this.getShortDateString(maxDate);
  }

  previous() {
    this.goBack('/calendarsettings');
  }
  isSlotNameunique(value: any) {
    const q = new Promise((resolve, reject) => {
      this.slotCreateService.checkRegularSlotName(value.value).pipe(take(1)).subscribe(data => {
        if (data && (data.status === 'SUCCESS' && data.data !== false)) {
          resolve({ exist: true });
          this.exist = true;
        } else {
          resolve(null);
          this.exist = false;
        }
      }, err => {
        resolve(null);
        this.exist = false;
      });
      // }, 100);
    });
    return q;
  }
  async onContinue() {
    this.disableContinueBtn = true;
    this.slotFormSubmitted = true;
    this.slotNameSubmitValidate();
    this.validateWeekDaysTimings();
    console.log(this.slotFormNew);
    if (this.isValidSlotName && this.slotFormNew.valid) {
      const slotData = new MerchantSlot();
      if (this.showDetails) {
        slotData.openingTime = null;
        slotData.closingTime = null;
        slotData.weekdayFlag = 'Y';
        this.validateWeekDaysTimings();
        if (this.isWeekDayError) {
          this.disableContinueBtn = false;
          return;
        }
        else {
          slotData.weekdays = this.timing;
          await this.onStartDateSelect(this.slotFormNew.value.startDate);
          if (this.isInvalidStartDate) {
            await this.presentAppointExistAlert(slotData);
          }
          else {
            this.submitSlotData(slotData);
          }
        }
      } else {
        slotData.weekdayFlag = 'N';
        slotData.weekdays = [];
        if (this.slotFormNew.get('openTime').value && this.slotFormNew.get('closeTime').value && this.slotFormNew.get('openTime').value < this.slotFormNew.get('closeTime').value && this.IsValidShopTime()) {
          await this.onStartDateSelect(this.slotFormNew.value.startDate);
          const openTime = new Time(this.slotFormNew.value.openTime);
          const closeTime = new Time(this.slotFormNew.value.closeTime);
          slotData.openingTime = openTime.toShortTimeString();
          slotData.closingTime = closeTime.toShortTimeString();
          if (this.isInvalidStartDate) {
            await this.presentAppointExistAlert(slotData);
          }
          else {
            this.submitSlotData(slotData);
          }
        }
        else {
          this.disableContinueBtn = false;
          return;
        }
      }
    }
    else {
      this.disableContinueBtn = false;
    }
  }

  async presentAppointExistAlert(slotData: MerchantSlot) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      message: ' There are exisiting appointments on this date. Do you want to Continue?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: (no) => {
            console.log('Slot creation Canceled!');
            this.disableContinueBtn = false;
            return;
          },
        },
        {
          text: 'Yes',
          cssClass: 'secondary',
          handler: async () => {
            this.submitSlotData(slotData);
          },
        },
      ],
    });
    await alert.present();
  }

  submitSlotData(slotData: MerchantSlot) {
    const url = 'merchantSlots';
    const startDate = this.dateTimeObjFromIonDateTime(this.slotFormNew.value.startDate); /// need to check
    slotData.startDate = `${startDate.getFullYear()}-${('0' + (startDate.getMonth() + 1)).slice(-2)}-${('0' + startDate.getDate()).slice(-2)}`;
    slotData.name = this.slotFormNew.value.name;
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    this.slotCreateService.UpdateSlot(slotData, url).subscribe(
      (response) => {
        loading.then(l => l.dismiss());
        if (response && response.status === 'SUCCESS') {
          if (response.data.appointmentFlag) {
            this.isInvalidStartDate = true;
            this.disableContinueBtn = false;
          }
          else {
            this.isInvalidStartDate = false;
            this.disableContinueBtn = false;
            const msg = 'Successfully creted the slot';
            this.toast.showToast(msg);
            this.sharedService.changeSlotTimeManagementRefresh(1);
            this.location.back();
          }
        }
        else {
          this.disableContinueBtn = false;
          this.toast.showToast('Something went wrong, Please try again');
        }
      }
    );
  }

  onStartDateSelect(endDate: string) {
    const q = new Promise((resolve, reject) => {
      const date = new Date(endDate);
      // const date = this.dateTimeObjFromIonDateTime(endDate);
      const selectedDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
      const loading = this.loadingCtrl.create();
      loading.then(l => l.present());
      this.slotCreateService.CheckSlotStartDate(selectedDate).subscribe(
        (response) => {
          loading.then(l => l.dismiss());
          if (response && response.status === 'SUCCESS') {
            if (response.data > 0) {
              this.isInvalidStartDate = true;
            } else {
              this.isInvalidStartDate = false;
            }
            resolve(1);
          }
          else {
            this.toast.showToast('Something went wrong, Please try again');

            resolve(0);
          }
        },
        err => {
          resolve(err);
        }
      );
    });
    return q;
  }

  IsValidShopTime(): boolean {
    // const shopOpenTime = this.dateTimeObjFromIonDateTime(this.slotFormNew.value.openTime);
    // const shopCloseTime = this.dateTimeObjFromIonDateTime(this.slotFormNew.value.closeTime);
    const shopOpenTime = this.dateTimeObjFromMysqlTime(this.slotFormNew.value.openTime);
    const shopCloseTime = this.dateTimeObjFromMysqlTime(this.slotFormNew.value.closeTime);
    let isValidShopTime = false;
    if (this.slotFormNew.value.openTime && this.slotFormNew.value.closeTime) {
      if (shopOpenTime.getHours() !== shopCloseTime.getHours()) {
        isValidShopTime = true;
      }
      else if (shopOpenTime.getMinutes() !== shopCloseTime.getMinutes()) {
        isValidShopTime = true;
      }
      else {
        isValidShopTime = false;
      }
    }
    else {
      isValidShopTime = false;
    }

    if (isValidShopTime) {
      this.slotFormNew.get('closeTime').setErrors(null);
    }
    else {

      this.slotFormNew.get('closeTime').setErrors({ invalidShopTime: true });
    }

    return isValidShopTime;
  }

  slotNameValidate(event) {
    // tslint:disable-next-line: deprecation
    const theEvent = event || window.event;
    let key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    const regex = /[a-zA-Z\s]/;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) {
        theEvent.preventDefault();
      }
    }

    this.slotNameSubmitValidate();
  }

  slotNameSubmitValidate() {
    const nameRegex = /^[a-zA-Z0-9_ ]*$/;
    const specialRegex = /[^a-zA-Z\s]+/;
    this.isValidSlotName = nameRegex.test(this.slotFormNew.value.name) && !specialRegex.test(this.slotFormNew.value.name);
  }

  gotoUrl(url: string) {
    this.nav.GoForward(url);
  }

  goBack(url: string) {
    this.nav.GoBackTo(url);
  }

  getShortDateString(date: Date): string {
    return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
  }

  toggleWeekdays() {
    this.showDetails = !this.showDetails;
    if (this.showDetails === true) {
      this.slotFormNew.get('openTime').disable();
      this.slotFormNew.get('closeTime').disable();
      this.slotFormNew.get('openTime').setValue(null);
      this.slotFormNew.get('closeTime').setValue(null);
    } else {
      this.slotFormNew.get('openTime').enable();
      this.slotFormNew.get('closeTime').enable();
    }
  }
  // convert mysql datetime to js date obj
  dateTimeObjFromMysqlDateTime(str: string) {
    if (str) {
      const dateTimeArr = str.split(/[- :]/);
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
      const timeObj = new Date(Number(timeArr[0]), Number(timeArr[1]) - 1, Number(timeArr[2]), Number(timeArr[3]), Number(timeArr[4]), Number(timeArr[5]));
      return timeObj;
    } else { return null; }
  }
  // convert html input date/time to js date obj
  dateTimeObjFromIonDateTime(str: string) {
    if (str) {
      const dateTimeStr = (str.split(/[\.\+]/)[0]).split('T')[0] + ' ' + (str.split(/[\.\+]/)[0]).split('T')[1];
      const dateTimeArr = dateTimeStr.split(/[- :]/);
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

  weekDaysTimeChange(item, type, value) {
    item[type] = value;
    this.validateWeekDaysTimings();
  }

  validateWeekDaysTimings() {
    this.isWeekDayError = false;
    this.errorDay = '';
    if (this.slotFormSubmitted && this.showDetails === true) {
      const defaultTime = new Time();
      for (const day of this.timing) {
        const openTime = new Time(day.openingTime);
        const closeTime = new Time(day.closingTime);
        if (openTime.isEqual(defaultTime)) {
          this.errorDay = `Please select shop open time for ${this.weekDayMapping[day.day]}`;
          this.isWeekDayError = true;
          break;
        }
        else if (closeTime.isEqual(defaultTime)) {
          this.errorDay = `Please select shop close time for ${this.weekDayMapping[day.day]}`;
          this.isWeekDayError = true;
          break;
        }
        else if (openTime.isGreaterThan(closeTime) || openTime.isEqual(closeTime)) {
          this.errorDay = `${this.weekDayMapping[day.day]} Shop Close time must be greater than Open time`;
          this.isWeekDayError = true;
          break;
        }
      }
    }
    else {
      return true;
    }
  }

  applyToAllWeekDays(item) {
    if (item.openingTime && item.closingTime) {
      for (const day of this.timing) {
        day.openingTime = item.openingTime;
        day.closingTime = item.closingTime;
      }
    }
  }
}
