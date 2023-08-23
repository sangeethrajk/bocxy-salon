import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController, NavController } from '@ionic/angular';
import { MerchantSlot, MerchantSlotDetails, ProfessionList, MerchantSpecialSlot } from './slogconfig.model';
import { SlotConfigService } from './slogconfig.service';
import { ToastService } from '../_services/toast.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PermissionService } from '../_services/permission.service';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { Time } from '../_models/Time.model';
import { DatePicker } from '@ionic-native/date-picker/ngx';
@Component({
  selector: 'app-slotconfig',
  templateUrl: './slotconfig.page.html',
  styleUrls: ['./slotconfig.page.scss'],
})
export class SlotconfigPage implements OnInit {
  constructor(
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    private slotService: SlotConfigService,
    private toast: ToastService,
    private loadingctrl: LoadingController,
    private formBuilder: FormBuilder,
    private permissionService: PermissionService,
    private nav: NavigationHandler,
    private datePicker: DatePicker
  ) {
    this.permissionService.checkPermissionAccess('STYLIST_SLOT_CONFIGURATION').then(
      data => {
        if (!data) {
          this.navCtrl.navigateRoot('/login');
        }
      }
    );
  }
  isChecked: string;
  slots: any = {};
  professionList: ProfessionList[];
  slotForm: FormGroup;
  selectedProfessionistSlot: any[] = [];
  merchantSlotList: MerchantSlot[];
  merchantSpecialSlotList: MerchantSpecialSlot[];
  selectedSlotId: any;
  slotCheckAll = false;
  saveDisable = true;
  showDailySlot: boolean;
  checkStartTimeError = false;
  checkEndTimeError = false;
  checkTimeError = false;
  enableTiming = false;
  slotStartTime: string;
  slotEndTime: string;
  slotTiming: any;

  myDate: string;
  myTime: string;
  myDateNTime: string;

  weekDayMapping = { 1: 'Sun', 2: 'Mon', 3: 'Tue', 4: 'Wed', 5: 'Thu', 6: 'Fri', 7: 'Sat' };
  timing = [
    { day: 1, openingTime: '', closingTime: '', isLeave: false },
    { day: 2, openingTime: '', closingTime: '', isLeave: false },
    { day: 3, openingTime: '', closingTime: '', isLeave: false },
    { day: 4, openingTime: '', closingTime: '', isLeave: false },
    { day: 5, openingTime: '', closingTime: '', isLeave: false },
    { day: 6, openingTime: '', closingTime: '', isLeave: false },
    { day: 7, openingTime: '', closingTime: '', isLeave: false }
  ];

  errorDay: string;
  isWeekDayError = false;
  slotFormSubmitted = false;

  customActionSheetOptionsSlot: any = {
    header: 'Select Slots'
  };
  customActionSheetOptions: any = {
    header: 'Select Stylist',
  };

  /*Time-Picker*/
  showTimepicker(item, type) {
    if (this.showDailySlot && item && item.isLeave) {
      return;
    }
    const currentDate = new Date();
    if (this.showDailySlot) {
      if (item && item[type] && item[type] !== '') {
        const time = new Time(item[type]);
        currentDate.setHours(time.Hour);
        currentDate.setMinutes(time.Minutes);
      }
    }
    else {
      if (type === 'openingTime') {
        const time = new Time(this.slotForm.get('startTime').value);
        currentDate.setHours(time.Hour);
        currentDate.setMinutes(time.Minutes);
      }
      else if (type === 'closingTime') {
        const time = new Time(this.slotForm.get('endTime').value);
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
        if (this.showDailySlot) {
          this.weekDaysTimeChange(item, type, selectedTime);
        }
        else {
          if (type === 'openingTime') {
            this.slotForm.get('startTime').setValue(selectedTime);
          }
          else if (type === 'closingTime') {
            this.slotForm.get('endTime').setValue(selectedTime);
          }
        }
      },
      err => console.log('Error occurred while getting time: ', err)
    );
  }
  /* slots = ['08.00', '08.30', '09.00', '09.30', '10.00', '10.30', '11.00', '11.30', '12.00', '12.30', '01.30', '02.00', '02.30', '03.00', '03.30', '04.00', '04.30', '05.00', '05.30', '06.00'] */

  async ngOnInit() {
    this.saveDisable = false;
    this.slotForm = this.formBuilder.group({
      slotType: ['', [Validators.required]],
      stylist: ['', [Validators.required]],
      slot: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
    try {
      const loading = await this.loadingctrl.create({
        spinner: 'bubbles',
        message: 'Please wait...',
        cssClass: 'custom-spinner',
      });
      loading.present();
      this.slotService.getProfessionalList().subscribe(data => {
        if (data.data && data.status === 'SUCCESS') {
          this.professionList = data.data;
        }
        else {
          loading.dismiss();
          this.toast.showToast('Something went wrong');
        }
      }, (error) => {
        console.log(error);
        this.toast.showToast('Something went wrong');
      });

      loading.dismiss();
    }
    catch (err) {
      console.log('something went wrong: ', err);
    }

  }

  diff_minutes_start(slotStartTime, slotEndTime, time1) {
    const slortstartTimeObj = this.dateTimeObjFromMysqlTime(slotStartTime);
    const slotEndTimeCheckObj = this.dateTimeObjFromMysqlTime(slotEndTime);


    // const time1Obj = this.dateTimeObjFromMysqlDateTime(time1);
    const time1Obj = this.dateTimeObjFromMysqlTime(time1);
    const endTime = this.slotForm.value.endTime;

    if (slortstartTimeObj <= time1Obj && slotEndTimeCheckObj >= time1Obj) {
      if (endTime != '' && endTime != undefined) {
        const endTimeObj = this.dateTimeObjFromMysqlTime(endTime);
        if (time1Obj < endTimeObj) {
          return true;
        } else {
          console.log('err 1');
          return false;
        }

      } else {
        return true;
      }

    } else {
      console.log('err 2');
      return false;
    }
  }

  diff_minutes_end(slotStartTime, slotEndTime, time1) {
    const slortstartTimeObj = this.dateTimeObjFromMysqlTime(slotStartTime);
    const slotEndTimeCheckObj = this.dateTimeObjFromMysqlTime(slotEndTime);

    // const time1Obj = this.dateTimeObjFromMysqlDateTime(time1);
    const time1Obj = this.dateTimeObjFromMysqlTime(time1);
    const startTime = this.slotForm.value.startTime;
    if (slortstartTimeObj <= time1Obj && slotEndTimeCheckObj >= time1Obj) {
      if (startTime != '' && startTime != undefined) {
        const startTimeObj = this.dateTimeObjFromMysqlTime(startTime);
        if (time1Obj > startTimeObj) {

          return true;
        } else {
          console.log('err 1');
          return false;
        }
      } else {
        return true;
      }
    } else {
      console.log('err 2');
      return false;
    }
  }

  checkStyleStartTime() {
    setTimeout(() => {
      if (this.slotForm.value.startTime) {
        // const startTime = (this.slotForm.value.startTime.split(/[\.\+]/)[0]).split("T")[0] + " " + (this.slotForm.value.startTime.split(/[\.\+]/)[0]).split("T")[1];
        const startTime = this.slotForm.value.startTime;
        if (startTime) {
          this.checkTimeError = false;
          const checkStartTime = this.diff_minutes_start(this.slotStartTime, this.slotEndTime, startTime);
          if (!checkStartTime) {
            this.checkStartTimeError = true;
          } else {
            this.checkStartTimeError = false;
          }

        } else {
          this.checkTimeError = true;
        }
      }
      else {
        this.checkTimeError = true;
      }
    }, 0);
  }

  checkStyleEndTime() {
    setTimeout(() => {
      if (this.slotForm.value.endTime) {
        // const endTime = (this.slotForm.value.endTime.split(/[\.\+]/)[0]).split("T")[0] + " " + (this.slotForm.value.endTime.split(/[\.\+]/)[0]).split("T")[1];
        const endTime = this.slotForm.value.endTime;
        if (endTime) {
          this.checkTimeError = false;
          const checkEndTime = this.diff_minutes_end(this.slotStartTime, this.slotEndTime, endTime);
          if (!checkEndTime) {
            this.checkEndTimeError = true;
          } else {
            this.checkEndTimeError = false;
          }
        } else {
          this.checkTimeError = true;
        }
      }
      else {
        this.checkTimeError = true;
      }
    }, 0);
  }


  changeStylistDropdown() {
    const stylistId = this.slotForm.value.stylist;
    const slotType = this.slotForm.value.slotType.toLowerCase();
    if (stylistId && slotType && this.slotForm.value.slot) {
      for (const slot of this.timing) {
        slot.openingTime = '';
        slot.closingTime = '';
        slot.isLeave = false;
      }
      this.slotService.getProfessionistSlots(stylistId, slotType.toUpperCase(), this.slotForm.value.slot).subscribe(data => {
        if (data && data.status === 'SUCCESS') {
          this.selectedProfessionistSlot = data.data;
          if (slotType === 'regular' && this.slots.weekdayFlag === 'Y') {
            this.slotForm.get('startTime').disable();
            this.slotForm.get('endTime').disable();
            if (this.selectedProfessionistSlot.length > 0) {
              for (const time of this.timing) {
                for (const stylistTime of this.selectedProfessionistSlot) {
                  if (time.day === stylistTime.day) {
                    if (stylistTime.availability.length > 0) {
                      time.openingTime = stylistTime.availability[0].startTime;
                      time.closingTime = stylistTime.availability[0].endTime;
                    }
                    else {
                      time.isLeave = true;
                    }
                    break;
                  }
                }
              }
              // this.showDailySlot = true;
            }
            else {
              this.selectedProfessionistSlot = [];
            }
          }
          else {
            this.slotForm.get('startTime').enable();
            this.slotForm.get('endTime').enable();
            if (this.selectedProfessionistSlot.length > 0) {
              this.slotForm.get('startTime').setValue(this.selectedProfessionistSlot[0].startTime);
              this.slotForm.get('endTime').setValue(this.selectedProfessionistSlot[0].endTime);
            }
            else {
              this.selectedProfessionistSlot = [];
              this.slotForm.get('startTime').setValue(null);
              this.slotForm.get('endTime').setValue(null);
            }
          }
          this.checkTimeError = false;
          // this.enableSaveButton();
        }
      });
    }
  }

  async onSlotTypeChange() {
    this.isWeekDayError = false;
    this.errorDay = '';
    const loading = await this.loadingctrl.create({
      spinner: 'bubbles',
      message: 'Please wait...',
      cssClass: 'custom-spinner',
    });
    loading.present();
    const url = this.slotForm.value.slotType.toLowerCase() === 'regular' ? 'merchantSlotList' : 'merchantSpecialSlotList';
    this.slotService.getMerchantSlotList(url).subscribe(data => {
      if (data.data && data.status === 'SUCCESS') {
        if (this.slotForm.value.slotType.toLowerCase() === 'regular') {
          this.merchantSlotList = this.filterSlots(data.data);
        } else {
          this.merchantSpecialSlotList = this.filterSplSlots(data.data);
        }
        this.changeStylistDropdown();
        loading.dismiss();
      }
      else {
        loading.dismiss();
        this.toast.showToast('Something went wrong');
      }
    }, (error) => {
      console.log(error);
      this.toast.showToast('Something went wrong');
    });
  }
  filterSlots(d) {
    const currentDateStart = new Date(new Date().setHours(0, 0, 0, 0)); // 00.00.00
    const currentDateEnd = new Date(new Date().setHours(23, 59, 59, 0)); // 23.59.59
    const e = d.filter(x => {
      const dbStart = this.dateTimeObjFromMysqlDateTime(x.startDate + ' 00:00:00');
      const dbEnd = this.dateTimeObjFromMysqlDateTime(x.endDate + ' 23:59:59');
      if ((currentDateStart >= dbStart && (!x.endDate || currentDateEnd <= dbEnd)) || (dbStart >= currentDateStart)) {
        return true;
      } else {
        return false;
      }
    });
    return e;
  }
  filterSplSlots(d) {
    const currentDateStart = new Date(new Date().setHours(0, 0, 0, 0)); // 00.00.00
    const currentDateEnd = new Date(new Date().setHours(23, 59, 59, 0)); // 23.59.59
    const e = d.filter(x => {
      const dbStart = this.dateTimeObjFromMysqlDateTime(x.startDate + ' 00:00:00');
      const dbEnd = this.dateTimeObjFromMysqlDateTime(x.endDate + ' 23:59:59');
      if ((currentDateStart >= dbStart && currentDateEnd <= dbEnd) || (dbStart >= currentDateStart)) {
        return true;
      } else {
        return false;
      }
    });
    return e;
  }
  async changeSlotDropdown(event) {
    this.enableTiming = true;
    this.slots = {};
    const i = 0;
    // const slotArray: FormArray = this.slotForm.get('slotCheckArray') as FormArray;
    this.slotForm.patchValue({
      startTime: '',
      endTime: ''
    });
    const loading = await this.loadingctrl.create({
      spinner: 'bubbles',
      message: 'Please wait...',
      cssClass: 'custom-spinner',
    });
    loading.present();
    this.selectedSlotId = event.target.value;
    const slotType = this.slotForm.value.slotType.toLowerCase();
    const url = slotType === 'regular' ? `merchantSlotDetails/${event.target.value}` : `merchantSpecialSlots/${event.target.value}`;
    this.slotService.getMerchantSlots(url).subscribe(data => {
      if (data.data && data.status === 'SUCCESS') {
        this.slots = data.data;
        if (slotType === 'regular') {
          if (this.slots.weekdayFlag === 'N') {
            this.showDailySlot = false;
            this.slotStartTime = this.slots.openingTime;
            this.slotEndTime = this.slots.closingTime;
          }
          else {
            this.slotTiming = {};
            this.showDailySlot = true;
            for (const slotDay of this.slots.weekdays) {
              this.slotTiming[slotDay.day] = { openingTime: slotDay.openingTime, closingTime: slotDay.closingTime };
            }
            // this.timing = this.slots.weekdays;
          }
        }
        else if (slotType === 'special') {
          this.slotStartTime = this.slots.openingTime;
          this.slotEndTime = this.slots.closingTime;
          this.showDailySlot = false;
        }

        this.changeStylistDropdown();
        loading.dismiss();
      }
      else {
        loading.dismiss();
        this.toast.showToast('Something went wrong');
      }
    }, (error) => {
      console.log(error);
      this.toast.showToast('Something went wrong');
    });
    // this.enableSaveButton();
  }

  checkSelectedSlot() {
    // const slotArray: FormArray = this.slotForm.get('slotCheckArray') as FormArray;
    for (let j = 0; j < this.slots.length; j++) {
      this.slots[j].checked = false;
    }
    if (this.selectedProfessionistSlot.length > 0) {
      for (let i = 0; i < this.selectedProfessionistSlot.length; i++) {
        const list = this.slots.filter(x => x.slotId === this.selectedProfessionistSlot[i].slotId);
        if (list.length > 0) {
          list[0].checked = true;
        }
      }
    }
    this.slotCheckAll = this.slots.filter(x => x.checked === false).length === 0;
  }

  onSlotCheckboxChange(event, index) {
    const slotArray: FormArray = this.slotForm.get('slotCheckArray') as FormArray;
    this.slots[index].checked = event.target.checked;
    if (event.target.checked) {
      slotArray.push(new FormControl(event.target.value));
    }
    else {
      let i = 0;
      slotArray.controls.forEach((item: FormControl) => {
        if (item.value === event.target.value) {
          slotArray.removeAt(i);
          return;
        }
        i++;
      });
    }
    this.slotCheckAll = (this.slots.length === slotArray.controls.length);
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

  saveSlots() {
    this.slotFormSubmitted = true;
    this.checkStyleStartTime();
    this.checkStyleEndTime();
    if (this.slotForm.valid) {
      const slotType = this.slotForm.value.slotType.toUpperCase();
      const postData: any = {};
      postData.accountId = this.slotForm.value.stylist;
      postData.slotType = slotType;
      postData.weekdayFlag = this.slots.weekdayFlag;
      if (slotType === 'REGULAR') {
        postData.merchantSlotId = this.slotForm.value.slot;
        if (this.slots.weekdayFlag === 'Y') {
          this.validateWeekDaysTimings();
          if (this.isWeekDayError) {
            return;
          }
          else {
            let isDayAvailable = false;
            for (const time of this.timing) {
              isDayAvailable = false;
              for (const stylistTime of this.selectedProfessionistSlot) {
                if (time.day === stylistTime.day) {
                  isDayAvailable = true;
                  if (time.isLeave) {
                    stylistTime.availability = [];
                    break;
                  }
                  else if (stylistTime.availability.length > 0) {
                    stylistTime.availability[0].startTime = time.openingTime;
                    stylistTime.availability[0].endTime = time.closingTime;
                    break;
                  }
                  else {
                    stylistTime.availability.push({ startTime: time.openingTime, endTime: time.closingTime });
                    break;
                  }
                }
              }
              if (!isDayAvailable) {
                this.selectedProfessionistSlot.push({ day: time.day, availability: [{ startTime: time.openingTime, endTime: time.closingTime }] });
              }
            }

            postData.timings = this.selectedProfessionistSlot;
          }
        }
      }
      else {
        postData.weekdayFlag = null;
        postData.merchantSlotId = null;
        postData.merchantSpecialSlotId = this.slotForm.value.slot;
      }
      if (postData.weekdayFlag === null || postData.weekdayFlag === 'N') {
        if (this.checkStartTimeError || this.checkEndTimeError || this.checkTimeError) {
          return;
        }
        postData.timings = [{
          startTime: this.slotForm.value.startTime,
          endTime: this.slotForm.value.endTime,
        }];
      }

      this.slotService.saveProfessionistSlots(postData).subscribe(data => {
        if (data && data.status === 'SUCCESS') {
          this.navCtrl.navigateRoot('/home/tabs/storeconfig');
          this.toast.showToast('Saved successfully');
        } else {
          this.toast.showToast('Problem occured');
        }
      }, async (err) => {
        this.toast.showToast('Problem occured');
      });

      // console.log(postData);
    }
  }

  gotoUrl(url: string) {
    this.nav.GoForward(url);
  }

  goBack(url: string) {
    this.nav.GoBackTo(url);
  }


  gotToAddStylist() {
    this.navCtrl.navigateRoot('addstylist');
  }

  onSlotCheckAllChange() {
    this.slotCheckAll = true;
    for (let i = 0; i < this.slots.length; i++) {
      this.slots[i].checked = this.slotCheckAll;
    }
  }
  onSlotUnCheckAllChange() {
    this.slotCheckAll = false;
    for (let i = 0; i < this.slots.length; i++) {
      this.slots[i].checked = this.slotCheckAll;
    }
  }
  enableSaveButton() {
    // Enabling save button
    if (this.slotForm.value.stylist && this.slotForm.value.slot && this.slotForm.value.startTime && this.slotForm.value.endTime && this.checkStartTimeError == false && this.checkEndTimeError == false) {
      this.saveDisable = false;
    } else {
      this.saveDisable = true;
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

  weekDaysTimeChange(item, type, value) {
    const dateTime = new Date(value);
    if (dateTime.toString() === 'Invalid Date') {
      item[type] = value;
    }
    else {
      item[type] = this.convertTime(value);
    }
    this.validateWeekDaysTimings();
  }

  validateWeekDaysTimings() {
    this.isWeekDayError = false;
    this.errorDay = '';
    if (this.slotFormSubmitted && this.showDailySlot === true) {
      const defaultTime = new Time();
      for (const day of this.timing) {
        if (!day.isLeave) {
          const openTime = new Time(day.openingTime);
          const closeTime = new Time(day.closingTime);
          if (openTime.isEqual(defaultTime)) {
            this.errorDay = `Please select start time for ${this.weekDayMapping[day.day]}`;
            this.isWeekDayError = true;
            break;
          }
          else if (closeTime.isEqual(defaultTime)) {
            this.errorDay = `Please select end time for ${this.weekDayMapping[day.day]}`;
            this.isWeekDayError = true;
            break;
          }
          else if (openTime.isGreaterThan(closeTime) || openTime.isEqual(closeTime)) {
            this.errorDay = `${this.weekDayMapping[day.day]} End time must be greater than start time`;
            this.isWeekDayError = true;
            break;
          }
          else if (this.slotTiming[day.day] && openTime.isLessThan(new Time(this.slotTiming[day.day].openingTime))) {
            this.errorDay = `${this.weekDayMapping[day.day]} Start time must be greater than shop Open time`;
            this.isWeekDayError = true;
            break;
          }
          else if (this.slotTiming[day.day] && closeTime.isGreaterThan(new Time(this.slotTiming[day.day].closingTime))) {
            this.errorDay = `${this.weekDayMapping[day.day]} End time must be less than shop close time`;
            this.isWeekDayError = true;
            break;
          }
        }
      }
    }
    else {
      return true;
    }
  }

  applyToAllWeekDays(item) {
    if (!item.isLeave && item.openingTime && item.closingTime) {
      for (const day of this.timing) {
        if (!day.isLeave) {
          day.openingTime = item.openingTime;
          day.closingTime = item.closingTime;
        }
      }
    }
  }

  markAsLeave(item, isSelected) {
    if (isSelected) {
      item.openingTime = null;
      item.closingTime = null;
      if (!item.isLeave) {
        item.isLeave = true;
      }
    }
    else {
      item.isLeave = false;
    }
  }
}
