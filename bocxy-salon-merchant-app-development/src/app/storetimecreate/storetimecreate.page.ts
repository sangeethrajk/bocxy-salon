import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { StoreSpecialSlot } from '../storetimemgmt/StoreSlot.model';
import { SlotInputTime } from './slotInputTime.model';
import { SlotTimeCreateService } from './slottimecreate.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../_services/toast.service';
import { SlotGroup } from '../_models/slotGroup.model';
import { MerchantSpecialSlot } from './storeMerchantSlot.model';
import { LoadingController } from '@ionic/angular';
import { SharedService } from '../_services/shared.service';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { DateService } from '../_services/date.service';
import { take } from 'rxjs/operators';
import { Time } from '../_models/Time.model';
import { DatePicker } from '@ionic-native/date-picker/ngx';

@Component({
  selector: 'app-storetimecreate',
  templateUrl: './storetimecreate.page.html',
  styleUrls: ['./storetimecreate.page.scss'],
})
export class StoretimecreatePage implements OnInit {

  isEditable: boolean;
  slotInput: SlotInputTime;
  public slotForm: FormGroup;
  slotFormSubmitted: boolean;
  disableContinueBtn: boolean;
  isValidSlotName: boolean;
  canLoadSlotForm: boolean;
  slotGroupList: SlotGroup[];
  isInvalidStartDate: boolean;
  minStartDate: string;
  maxstartDate: string;
  minEndDate: string;
  maxEndDate: string;
  title: boolean;
  slotType: string;
  isValidspecialSlotDateRange: boolean;
  exist: boolean;
  editData: boolean;
  constructor(
    private location: Location,
    public router: Router,
    private slotCreateService: SlotTimeCreateService,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private sharedService: SharedService,
    private nav: NavigationHandler,
    private dateService: DateService,
    private datePicker: DatePicker
  ) { }

  ngOnInit() {
    //this.slotGroupList = [];
    this.isValidspecialSlotDateRange = true;
    this.canLoadSlotForm = false;
    //this.getSlotGroups();
    const param = this.router.getCurrentNavigation().extras.state;
    this.slotType = param.type;
    const slot = param.data === null ? null : param.data as StoreSpecialSlot;
    this.isEditable = true;
    this.configStartDate();

    this.slotForm = this.formBuilder.group({
      name: [{ value: null, disabled: !this.isEditable }, Validators.compose([Validators.required]), this.isSlotNameunique.bind(this)],
      startDate: [{ value: null, disabled: !this.isEditable }, Validators.compose([
        Validators.required
      ])],
      endDate: [{ value: null, disabled: !this.isEditable }, Validators.compose([])],
      openTime: [{ value: null, disabled: !this.isEditable }, Validators.compose([
        Validators.required
      ])],
      closeTime: [{ value: null, disabled: !this.isEditable }, Validators.compose([
        Validators.required
      ])],
      //  slotGroupId: [{ value: null, disabled: !this.isEditable }, Validators.compose([Validators.required])]
    });
    if (slot) {
      this.slotInput = new SlotInputTime();
      this.getSlotInput(slot);
      this.editData = true;
    }
    else {
      this.disableContinueBtn = false;
    }
    this.isValidSlotName = false;
    this.canLoadSlotForm = true;
  }

  showTimepicker(type) {
    const currentDate = new Date();
    if (type === 'openTime') {
      var time = new Time(this.slotForm.get('openTime').value);
      currentDate.setHours(time.Hour);
      currentDate.setMinutes(time.Minutes);
    }
    else if (type === 'closeTime') {
      var time = new Time(this.slotForm.get('closeTime').value);
      currentDate.setHours(time.Hour);
      currentDate.setMinutes(time.Minutes);
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

        if (type === 'openTime') {
          this.slotForm.get('openTime').setValue(selectedTime);

        }
        else {
          this.slotForm.get('closeTime').setValue(selectedTime);
        }
        this.IsValidShopTime();
      },
      err => console.log('Error occurred while getting time: ', err)
    );
  }

  isSlotNameunique(value: any) {
    const q = new Promise((resolve, reject) => {
      console.log(value.value);

      this.slotCreateService.checkRegularSplSlotName(value.value).pipe(take(1)).subscribe(data => {
        if (data && (data.status === 'SUCCESS' && data.data !== false)) {
          if (this.slotInput && this.slotInput !== undefined) {
            if (value.value === this.slotInput.name) {
              resolve(null);
              console.log(value.value);
              this.exist = false;
            } else if (data && (data.status === 'SUCCESS' && data.data === true)) {
              resolve({ exist: true });
              this.exist = true;
            } else {
              resolve(null);
              this.exist = false;
            }
          }
          else {
            resolve({ exist: true });
            this.exist = true;
          }
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
  configStartDate() {
    const minDate = new Date();
    this.minStartDate = `${minDate.getFullYear()}-${('0' + (minDate.getMonth() + 1)).slice(-2)}-${('0' + minDate.getDate()).slice(-2)}`;
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 365);
    this.maxstartDate = `${maxDate.getFullYear()}-${('0' + (maxDate.getMonth() + 1)).slice(-2)}-${('0' + maxDate.getDate()).slice(-2)}`;
    this.minEndDate = this.minStartDate;
    const maxEndDate = new Date();
    maxEndDate.setDate(maxEndDate.getDate() + 365);
    this.maxEndDate = `${maxEndDate.getFullYear()}-${('0' + (maxEndDate.getMonth() + 1)).slice(-2)}-${('0' + maxEndDate.getDate()).slice(-2)}`;
  }

  previous() {
    this.location.back();
  }

  getSlotInput(slot: StoreSpecialSlot) {
    const loading = this.loadingCtrl.create();
    const url: string = 'merchantSpecialSlots';
    loading.then(l => l.present());
    this.slotCreateService.GetMerchantSlot(slot.merchantSpecialSlotId, url).subscribe(
      (response) => {
        if (response && response.status === 'SUCCESS') {
          this.slotInput = response.data;
          this.slotForm.get('name').setValue(this.slotInput.name);
          this.slotForm.get('startDate').setValue(this.getDateTimeFromDate(this.slotInput.startDate));
          this.slotForm.get('endDate').setValue(this.getDateTimeFromDate(this.slotInput.endDate));
          this.slotForm.get('openTime').setValue(this.slotInput.openingTime);
          this.slotForm.get('closeTime').setValue(this.slotInput.closingTime);
          loading.then(l => l.dismiss());
        }
        else {
          this.toast.showToast('Something went wrong, Please try again');
        }
      }
    );
  }

  getSlotGroups() {
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    this.slotCreateService.GetSlotGroupList().subscribe(
      (response) => {
        loading.then(l => l.dismiss());
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
    this.disableContinueBtn = true;
    this.slotFormSubmitted = true;
    this.slotNameSubmitValidate();
    //this.onSlotDurationChange();    
    if (this.isValidSlotName && this.slotForm.valid && !this.isInvalidStartDate && this.IsValidShopTime()) {
      let slotData: any;
      let url: string;
      slotData = new MerchantSpecialSlot();
      url = 'merchantSpecialSlots';
      slotData.endDate = this.slotForm.value.endDate;
      if (!this.validateSpecialSlotDate()) {
        this.disableContinueBtn = false;
        return;
      }
      const openTime = new Time(this.slotForm.value.openTime);
      const closeTime = new Time(this.slotForm.value.closeTime);
      slotData.openingTime = openTime.toShortTimeString();
      slotData.closingTime = closeTime.toShortTimeString();
      const startDate = new Date(this.slotForm.value.startDate);
      slotData.startDate = `${startDate.getFullYear()}-${('0' + (startDate.getMonth() + 1)).slice(-2)}-${('0' + startDate.getDate()).slice(-2)}`;
      slotData.name = this.slotForm.value.name;
      const loading = this.loadingCtrl.create();
      loading.then(l => l.present());

      if (!this.slotInput) {
        this.slotCreateService.UpdateSlot(slotData, url).subscribe(
          (response) => {
            loading.then(l => l.dismiss());
            this.SlotUpdateResponseHandler(response);
          }
        );
      }
      else {
        this.slotCreateService.PutSpecialSlot(slotData, this.slotInput.merchantSpecialSlotId).subscribe(
          (response) => {
            loading.then(l => l.dismiss());
            this.SlotUpdateResponseHandler(response);
          }
        );
      }
    }
    else {
      this.disableContinueBtn = false;
    }
  }

  onStartDateSelect(endDate: string) {
    if (this.slotForm.value.startDate && this.slotForm.value.endDate) {
      this.minEndDate = this.slotForm.value.startDate;
      const splStartdate = this.getShortDateString(this.dateTimeObjFromIonDateTime(this.slotForm.value.startDate));
      const splEndDate = this.getShortDateString(this.dateTimeObjFromIonDateTime(this.slotForm.value.endDate));
      const loading = this.loadingCtrl.create();
      loading.then(l => l.present());
      this.slotCreateService.CheckSpecialSlotDate(splStartdate, splEndDate).subscribe(
        (response) => {
          loading.then(l => l.dismiss());
          if (response && response.status === 'SUCCESS') {
            if (response.data > 0) {
              this.isValidspecialSlotDateRange = false;
            }
            else {
              this.isValidspecialSlotDateRange = true;
            }
          }
          else {
            this.toast.showToast('Something went wrong, Please try again');
          }
        }
      );
    }
  }

  IsValidShopTime(): boolean {
    const shopOpenTime = new Time(this.slotForm.value.openTime);
    const shopCloseTime = new Time(this.slotForm.value.closeTime);
    let isValidShopTime = false;
    isValidShopTime = shopOpenTime.isLessThan(shopCloseTime);
    if (isValidShopTime) {
      this.slotForm.get('closeTime').setErrors(null);
    }
    else {

      this.slotForm.get('closeTime').setErrors({ invalidShopTime: true });
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
  }

  slotNameSubmitValidate() {
    const nameRegex = /^[a-zA-Z0-9_ ]*$/;
    const specialRegex = /[^a-zA-Z\s]+/;
    this.isValidSlotName = nameRegex.test(this.slotForm.value.name) && !specialRegex.test(this.slotForm.value.name);
  }

  gotoUrl(url: string) {
    this.nav.GoForward(url);
  }

  goBack(url: string) {
    this.nav.GoBackTo(url);
  }

  validateSpecialSlotDate() {
    return (this.slotForm.value.startDate && this.slotForm.value.endDate &&
      this.dateTimeObjFromIonDateTime(this.slotForm.value.startDate) <= this.dateTimeObjFromIonDateTime(this.slotForm.value.endDate) && this.isValidspecialSlotDateRange);
  }

  SlotUpdateResponseHandler(response: any) {
    if (response && response.status === 'SUCCESS') {
      if (response.data.appointmentFlag) {
        this.isInvalidStartDate = true;
        this.disableContinueBtn = false;
      }
      else {
        this.isInvalidStartDate = false;
        this.disableContinueBtn = false;
        const msg = this.slotInput ? 'Successfully updated the slot' : 'Successfully creted the slot';
        this.toast.showToast(msg);
        this.sharedService.changeSpecialSlotTimeManagementRefresh(1);
        this.nav.GoBackTo("/calendarsettings");
      }
    }
    else {
      this.disableContinueBtn = false;
      this.toast.showToast('Something went wrong, Please try again');
    }
  }

  getShortDateString(date: Date): string {
    return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
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
  // set html input Date
  getDateTimeFromDate(date: string): string {
    const dateTime = this.dateService.dateToObject(date);
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
}
