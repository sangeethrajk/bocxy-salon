import { Component, OnInit } from '@angular/core';
import { Location, formatDate } from '@angular/common';
import { MenuController, NavController, LoadingController } from '@ionic/angular';
import { Slotduration } from './slotduration.model';
import { SlotDurationServcie } from './slotduration.service';
import { ToastService } from '../_services/toast.service';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SlotGroup } from '../_models/slotGroup.model';
import { Time } from '../_models/Time.model';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';

@Component({
  selector: 'app-slotduration',
  templateUrl: './slotduration.page.html',
  styleUrls: ['./slotduration.page.scss'],
})
export class SlotdurationPage implements OnInit {
  showDetails: boolean;
  slotDuration: Slotduration;
  disableContinueBtn: boolean;
  public slotDurationForm: FormGroup;
  slotFormSubmitted: boolean;
  slotGroupList: SlotGroup[];
  isValidConfigName: boolean;
  isValidSlotDuration: boolean;

  constructor(
    private _location: Location,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    private slotDurationService: SlotDurationServcie,
    private loadingCtrl: LoadingController,
    private toast: ToastService,
    private storage: Storage,
    private formBuilder: FormBuilder,
    private datePicker: DatePicker
  ) { }

  errorDay: string;
  isWeekDayError: boolean = false;
  weekDayMapping = { 1: 'Sunday', 2: 'Monday', 3: 'Tuesday', 4: 'Wednesday', 5: 'Thursday', 6: 'Friday', 7: 'Saturday' };
  timing = [
    { day: 1, openingTime: '', closingTime: '' },
    { day: 2, openingTime: '', closingTime: '' },
    { day: 3, openingTime: '', closingTime: '' },
    { day: 4, openingTime: '', closingTime: '' },
    { day: 5, openingTime: '', closingTime: '' },
    { day: 6, openingTime: '', closingTime: '' },
    { day: 7, openingTime: '', closingTime: '' }
  ];

  ngOnInit() {
    this.slotDuration = new Slotduration();
    this.disableContinueBtn = false;
    this.isValidSlotDuration = true;
    this.slotDurationForm = this.formBuilder.group({
      configName: [null, Validators.compose([Validators.required])],
      openTime: [null, Validators.compose([
        Validators.required
      ])],
      closeTime: [null, Validators.compose([
        Validators.required
      ])],
      //slotGroupId: [null, Validators.compose([Validators.required])]
    });
    //this.getSlotGroupList();
    this.isValidConfigName = false;
  }

  showTimepicker(item, type) {
    const currentDate = new Date();
    if (this.showDetails) {
      if (item && item[type] && item[type] !== '') {
        var time = new Time(item[type]);
        currentDate.setHours(time.Hour);
        currentDate.setMinutes(time.Minutes);
      }
    }
    else {
      if (type === 'openingTime') {
        var time = new Time(this.slotDurationForm.get('openTime').value);
        currentDate.setHours(time.Hour);
        currentDate.setMinutes(time.Minutes);
      }
      else if (type === 'closingTime') {
        var time = new Time(this.slotDurationForm.get('closeTime').value);
        currentDate.setHours(time.Hour);
        currentDate.setMinutes(time.Minutes);
      }
    }
    this.datePicker.show({
      date: currentDate,
      mode: 'time',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      okText: "Save Time",
      //nowText: "Set Now",
      is24Hour: false
    }).then(
      time => {
        const selectedTime = ('0' + time.getHours()).slice(-2) + ":" + ('0' + time.getMinutes()).slice(-2) + ':00';
        if (this.showDetails) {
          this.weekDaysTimeChange(item, type, selectedTime);
        }
        else {
          if (type === 'openingTime') {
            this.slotDurationForm.get('openTime').setValue(selectedTime);

          }
          else {
            this.slotDurationForm.get('closeTime').setValue(selectedTime);
          }
        }
      },
      err => console.log('Error occurred while getting time: ', err)
    );
  }


  getSlotGroupList() {
    this.slotDurationService.GetSlotGroupList().subscribe(
      async (response) => {
        if (response && response.status === 'SUCCESS') {
          this.slotGroupList = response.data;
        }
        else {
          this.toast.showToast('Something went wrong, Please try again');
        }
      }
    );
  }

  onContinue() {
    this.slotFormSubmitted = true;
    this.disableContinueBtn = true;
    this.configNameSubmitValidate();
    //this.onSlotDurationChange();
    if (this.slotDurationForm.valid && this.isValidConfigName) {
      if (this.showDetails) {
        this.validateWeekDaysTimings();
        if (this.isWeekDayError) {
          this.disableContinueBtn = false;
          return;
        }
        else {
          this.slotDuration.openingTime = null;
          this.slotDuration.closingTime = null;
          this.slotDuration.weekdayFlag = 'Y';
          this.slotDuration.weekdays = this.timing;
        }

      }
      else {
        if (this.isValidSlotDuration) {
          const openDateTime = new Time(this.slotDurationForm.value.openTime);
          const closeDateTime = new Time(this.slotDurationForm.value.closeTime);
          this.slotDuration.openingTime = openDateTime.toShortTimeString();
          this.slotDuration.closingTime = closeDateTime.toShortTimeString();
          this.slotDuration.weekdayFlag = 'N';
          this.slotDuration.weekdays = [];
        }
        else {
          this.disableContinueBtn = false;
          return;
        }

      }
      this.slotDuration.name = this.slotDurationForm.value.configName.trim();
      const loading = this.loadingCtrl.create();
      loading.then(l => l.present());
      this.slotDurationService.UpdateSlotDuration(this.slotDuration).subscribe(
        response => {
          loading.then(l => l.dismiss());
          if (response && response.status === 'SUCCESS' && response.data === true) {
            this.navCtrl.navigateRoot('/home/tabs/tab1');
            this.storage.set('firstLogin', 'N');
          } else {
            this.toast.showToast('Something went wrong, Please try again');
            this.disableContinueBtn = false;
          }
        });
    }
    else {
      this.disableContinueBtn = false;
    }
  }

  IsValidShopTime(): boolean {
    const shopOpenTime = new Time(this.slotDurationForm.value.openTime);
    const shopCloseTime = new Time(this.slotDurationForm.value.closeTime);
    let isValidShopTime = false;
    isValidShopTime = shopOpenTime.isLessThan(shopCloseTime);

    if (isValidShopTime) {
      this.slotDurationForm.get('closeTime').setErrors(null);
    }
    else {

      this.slotDurationForm.get('closeTime').setErrors({ invalidShopTime: true });
    }

    return isValidShopTime;
  }

  configNameValidate(event) {
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
  }

  configNameSubmitValidate() {
    const nameRegex = /^[^\s]+([a-zA-Z]+\s?)*[^\s]+$/;
    const specialRegex = /[^a-zA-Z\s]+/;
    this.isValidConfigName = nameRegex.test(this.slotDurationForm.value.configName) &&
      !specialRegex.test(this.slotDurationForm.value.configName);
  }

  onSlotDurationChange() {
    //const slotGroup = this.slotDurationForm.value.slotGroupId;
    if (this.slotFormSubmitted && this.slotDurationForm.value.openTime && this.slotDurationForm.value.closeTime) {
      const shopOpenTime = this.dateTimeObjFromIonDateTime(this.slotDurationForm.value.openTime);
      const shopCloseTime = this.dateTimeObjFromIonDateTime(this.slotDurationForm.value.closeTime);
      let diff = (shopCloseTime.getTime() - shopOpenTime.getTime()) / 1000;
      this.isValidSlotDuration = diff > 0;
    }
    else {
      this.isValidSlotDuration = true;
    }
  }

  // convert mysql datetime to js date obj
  dateTimeObjFromMysqlDateTime(str: string) {
    if (str) {
      const dateTimeArr = str.split(/[- :]/);
      const dateTimeObj = new Date(Number(dateTimeArr[0]), Number(dateTimeArr[1]) - 1, Number(dateTimeArr[2]), Number(dateTimeArr[3]), Number(dateTimeArr[4]), Number(dateTimeArr[5]));
      return dateTimeObj;
    } else return null;
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
    } else return null;
  }
  // convert html input date/time to js date obj
  dateTimeObjFromIonDateTime(str: string) {
    if (str) {
      const dateTimeStr = (str.split(/[\.\+]/)[0]).split("T")[0] + " " + (str.split(/[\.\+]/)[0]).split("T")[1];
      const dateTimeArr = dateTimeStr.split(/[- :]/);
      const dateTimeObj = new Date(Number(dateTimeArr[0]), Number(dateTimeArr[1]) - 1, Number(dateTimeArr[2]), Number(dateTimeArr[3]), Number(dateTimeArr[4]), Number(dateTimeArr[5]));
      return dateTimeObj;
    } else return null;
  }
  // set html input time
  getDateTimeFromTime(time: string): string {
    const dateTime = new Date();
    const timeSplit = time.split(':');
    dateTime.setHours(timeSplit[0] as unknown as number);
    dateTime.setMinutes(timeSplit[1] as unknown as number);
    return dateTime.getFullYear() + "-" + this.twoDigits(1 + dateTime.getMonth()) + "-" + this.twoDigits(dateTime.getDate()) + "T" + this.twoDigits(dateTime.getHours()) + ":" + this.twoDigits(dateTime.getMinutes()) + ":" + this.twoDigits(dateTime.getSeconds()) + "+05:30";
  }
  twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
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

  toggleWeekdays() {
    this.showDetails = !this.showDetails;
    if (this.showDetails === true) {
      this.slotDurationForm.get('openTime').disable();
      this.slotDurationForm.get('closeTime').disable();
      this.slotDurationForm.get('openTime').setValue(null);
      this.slotDurationForm.get('closeTime').setValue(null);
    } else {
      this.slotDurationForm.get('openTime').enable();
      this.slotDurationForm.get('closeTime').enable();
    }
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
      for (let day of this.timing) {
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
      for (let day of this.timing) {
        day.openingTime = item.openingTime;
        day.closingTime = item.closingTime;
      }
    }
  }
}
