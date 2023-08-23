import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { HolidaymgmtService } from './holidaymgmt.service';
import { MerchantHoliday } from './holidaymgm.model';
import { ToastService } from '../_services/toast.service';
import { LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { SharedService } from '../_services/shared.service';
import { NavigationHandler } from '../_services/navigation-handler.service';

@Component({
  selector: 'app-holidaymgmt',
  templateUrl: './holidaymgmt.page.html',
  styleUrls: ['./holidaymgmt.page.scss'],
})
export class HolidaymgmtPage implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private httpService: HolidaymgmtService,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    public route: ActivatedRoute,
    private sharedService: SharedService,
    private nav: NavigationHandler
  ) {

  }
  selectedIndex: any;
  holidayForm: FormGroup;
  merchantHoliday: MerchantHoliday;
  formSubmitted: boolean;
  paramSubscription: Subscription;
  isEditable: boolean;

  repeatdays = [{ name: 'Sun', id: '1', isSelected: false }, { name: 'Mon', id: '2', isSelected: false },
  { name: 'Tue', id: '3', isSelected: false }, { name: 'Wed', id: '4', isSelected: false },
  { name: 'Thu', id: '5', isSelected: false }, { name: 'Fri', id: '6', isSelected: false },
  { name: 'Sat', id: '7', isSelected: false }];

  repeatDate = [{ name: '01', value: 1 }, { name: '02', value: 2 }, { name: '03', value: 3 },
  { name: '04', value: 4 }, { name: '05', value: 5 },
  { name: '06', value: 6 }, { name: '07', value: 7 }, { name: '08', value: 8 }, { name: '09', value: 9 }, { name: '10', value: 10 },
  { name: '11', value: 11 }, { name: '12', value: 12 }, { name: '13', value: 13 }, { name: '14', value: 14 }, { name: '15', value: 15 },
  { name: '16', value: 16 }, { name: '17', value: 17 }, { name: '18', value: 18 }, { name: '19', value: 19 }, { name: '20', value: 20 },
  { name: '21', value: 21 }, { name: '22', value: 22 }, { name: '23', value: 23 }, { name: '24', value: 24 }, { name: '25', value: 25 },
  { name: '26', value: 26 }, { name: '27', value: 27 }, { name: '28', value: 28 }];

  repeatData = [{ repeatType: 'WEEKLY', dateType: 'SINGLE', display: 'Weekly', value: 'weeklysingle' }, { repeatType: 'WEEKLY', dateType: 'MULTIPLE', display: 'Weekly (Multi days in a week)', value: 'weeklymulti' },
  { repeatType: 'MONTHLY', dateType: 'SINGLE', display: 'Monthly', value: 'monthlysingle' },
  { repeatType: 'MONTHLY', dateType: 'MULTIPLE', display: 'Monthly (Multi dates in a month)', value: 'monthlymulti' },
  { repeatType: 'YEARLY', dateType: 'SINGLE', display: 'Yearly', value: 'yearly' }, { repeatType: 'YEARLY', dateType: 'MULTIPLE', display: 'Yearly (Multi dates in a year)', value: 'yearlymulti' }];

  repeatmode = this.repeatData[0];


  async ngOnInit() {
    this.isEditable = false;
    this.paramSubscription = this.route.params.subscribe(
      async (params: Params) => {
        // tslint:disable-next-line: no-string-literal
        this.formSubmitted = false;
        this.merchantHoliday = new MerchantHoliday();
        if (params.merchantHolidayId) {
          this.isEditable = true;
          this.merchantHoliday = await this.getMerchantHoliday(params.merchantHolidayId);
          for (const data of this.repeatData) {
            if (data.repeatType === this.merchantHoliday.repeatType && data.dateType === this.merchantHoliday.dateType) {
              this.repeatmode = data;
              if (this.repeatmode.repeatType === 'WEEKLY') {
                if (this.repeatmode.dateType === 'SINGLE') {
                  const startDay: number = +this.merchantHoliday.startDay;
                  this.selectedIndex = startDay - 1;
                }
                else {
                  this.selectInBetweenWeekDays();
                }
              }
              break;
            }
          }
          this.holidayForm = this.createHolidayForm();
        }
        else {
          this.merchantHoliday.holidayType = 'PLANNED';
          this.merchantHoliday.dateType = 'SINGLE';
          this.holidayForm = this.createHolidayForm();
        }
        this.onRepeatModeChange();
        this.holidayTypeChange();
      }
    );
  }

  createHolidayForm() {
    return this.formBuilder.group(
      {
        title: [this.merchantHoliday.name, Validators.compose([Validators.required, Validators.pattern(/^[a-z]+( [a-z]+)*$/i)])],
        description: [this.merchantHoliday.description],
        monthlySingleStartDate: [this.repeatmode.value === 'monthlysingle' ? this.merchantHoliday.startDay : null,
        Validators.compose([Validators.required])],
        monthlyMultiStartDate: [this.repeatmode.value === 'monthlymulti' ? this.merchantHoliday.startDay : null,
        Validators.compose([Validators.required])],
        monthlyMultiEndDate: [this.repeatmode.value === 'monthlymulti' ? this.merchantHoliday.endDay : null,
        Validators.compose([Validators.required])],
        yearlyStartDate: [this.repeatmode.value === 'yearly' ? this.merchantHoliday.startDate.split(' ')[0] : null,
        Validators.compose([Validators.required])],
        yearlyMultiStartDate: [this.repeatmode.value === 'yearlymulti' ? this.merchantHoliday.startDate.split(' ')[0] : null
          , Validators.compose([Validators.required])],
        yearlyMultiEndDate: [this.repeatmode.value === 'yearlymulti' ? this.merchantHoliday.endDate.split(' ')[0] : null,
        Validators.compose([Validators.required])],
        UNStartDate: [this.merchantHoliday.holidayType === 'UNPLANNED' && this.merchantHoliday.dateType === 'SINGLE' ?
          this.merchantHoliday.startDate.split(' ')[0] : null,
        Validators.compose([Validators.required])],
        UNMultiStartDate: [this.merchantHoliday.holidayType === 'UNPLANNED' && this.merchantHoliday.dateType === 'MULTIPLE' ?
          this.merchantHoliday.startDate.split(' ')[0] : null,
        Validators.compose([Validators.required])],
        UNMultiEndDate: [this.merchantHoliday.holidayType === 'UNPLANNED' && this.merchantHoliday.dateType === 'MULTIPLE' ?
          this.merchantHoliday.endDate.split(' ')[0] : null,
        Validators.compose([Validators.required])]
      }
    );
  }

  goBack(url: string) {
    this.nav.GoBackTo(url);
  }

  WeeklySingleSelect(item, index) {
    this.selectedIndex = index;
    this.merchantHoliday.startDay = item.id;
  }

  weeklyMultiSelect(item) {

    item.isSelected = !item.isSelected;
    if (this.merchantHoliday.startDay && this.merchantHoliday.endDay &&
      this.merchantHoliday.endDay !== item.id && item.id > this.merchantHoliday.startDay && item.id < this.merchantHoliday.endDay) {
      item.isSelected = true;
      return;
    }

    if (item.isSelected) {
      if (!this.merchantHoliday.startDay) {
        this.merchantHoliday.startDay = item.id;
      }
      else if (item.id < this.merchantHoliday.startDay) {
        if (!this.merchantHoliday.endDay) {
          this.merchantHoliday.endDay = this.merchantHoliday.startDay;
        }
        this.merchantHoliday.startDay = item.id;
        this.selectInBetweenWeekDays();
      }
      else if (!this.merchantHoliday.endDay || item.id > this.merchantHoliday.endDay) {
        this.merchantHoliday.endDay = item.id;
        this.selectInBetweenWeekDays();
      }
    }
    else {
      if (!item.isSelected && item.id === this.merchantHoliday.startDay && item.id !== '7' && this.repeatdays[item.id].isSelected) {
        this.merchantHoliday.startDay = `${this.repeatdays[item.id].id}`;
      }
      else if (!item.isSelected && (item.id === this.merchantHoliday.endDay) && this.repeatdays[item.id - 2].isSelected) {
        this.merchantHoliday.endDay = `${this.repeatdays[item.id - 2].id}`;
      }

      if (this.merchantHoliday.startDay === this.merchantHoliday.endDay) {
        this.merchantHoliday.endDay = null;
      }
    }
  }

  selectInBetweenWeekDays() {
    const start: number = +this.merchantHoliday.startDay;
    const end: number = +this.merchantHoliday.endDay;
    for (let i = start - 1; i < end; i++) {
      this.repeatdays[i].isSelected = true;
    }
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.holidayForm.valid && this.ValidateHolidayForm()) {
      this.merchantHoliday.name = this.holidayForm.value.title;
      this.merchantHoliday.description = this.holidayForm.value.description;
      this.merchantHoliday.repeatType = this.repeatmode.repeatType;
      if (this.merchantHoliday.holidayType === 'PLANNED') {
        this.merchantHoliday.dateType = this.repeatmode.dateType;
        if (this.repeatmode.value === 'weeklysingle') {
          this.merchantHoliday.endDay = null;
          this.merchantHoliday.startDate = null;
          this.merchantHoliday.endDate = null;
        }
        else if (this.repeatmode.value === 'weeklymulti') {
          this.merchantHoliday.startDate = null;
          this.merchantHoliday.endDate = null;
        }
        else if (this.repeatmode.value === 'monthlysingle') {
          this.merchantHoliday.startDay = this.holidayForm.value.monthlySingleStartDate;
          this.merchantHoliday.endDay = null;
          this.merchantHoliday.startDate = null;
          this.merchantHoliday.endDate = null;
        }
        else if (this.repeatmode.value === 'monthlymulti') {
          this.merchantHoliday.startDay = this.holidayForm.value.monthlyMultiStartDate;
          this.merchantHoliday.endDay = this.holidayForm.value.monthlyMultiEndDate;
          this.merchantHoliday.startDate = null;
          this.merchantHoliday.endDate = null;
        }
        else if (this.repeatmode.value === 'yearly') {
          this.merchantHoliday.startDate = this.holidayForm.value.yearlyStartDate;
          this.merchantHoliday.startDay = null;
          this.merchantHoliday.endDay = null;
          this.merchantHoliday.endDate = null;
        }
        else if (this.repeatmode.value === 'yearlymulti') {
          this.merchantHoliday.startDate = this.holidayForm.value.yearlyMultiStartDate;
          this.merchantHoliday.endDate = this.holidayForm.value.yearlyMultiEndDate;
          this.merchantHoliday.startDay = null;
          this.merchantHoliday.endDay = null;
        }
        else {
          return;
        }
      }
      else if (this.merchantHoliday.holidayType === 'UNPLANNED') {
        if (this.merchantHoliday.dateType === 'SINGLE') {
          this.merchantHoliday.startDate = this.holidayForm.value.UNStartDate;
          this.merchantHoliday.endDate = null;
        }
        else if (this.merchantHoliday.dateType === 'MULTIPLE') {
          this.merchantHoliday.startDate = this.holidayForm.value.UNMultiStartDate;
          this.merchantHoliday.endDate = this.holidayForm.value.UNMultiEndDate;
        }
        else {
          return;
        }
        this.merchantHoliday.startDay = null;
        this.merchantHoliday.endDay = null;
        this.merchantHoliday.repeatType = null;
      }
      else {
        return;
      }
      const loading = this.loadingCtrl.create();
      loading.then(l => l.present());
      if (this.isEditable) {
        return new Promise((resolve, reject) => {
          this.httpService.updateHoliday(this.merchantHoliday).pipe().subscribe(
            (response) => {
              loading.then(l => l.dismiss());
              if (response && response.status === 'SUCCESS') {
                if (response.data) {
                  this.nav.GoBackTo('/holidaylist');
                  this.sharedService.changeHolidayList(1);
                }
                else {
                  this.toast.showToast('Failed to update holiday');
                }
              }
              resolve(1);
            },
            (error) => {
              loading.then(l => l.dismiss());
              this.toast.showToast('Something went wrong. Please try again');
              reject(1);
            }
          );
        });
      }
      else {
        this.merchantHoliday.active = 'N';
        return new Promise((resolve, reject) => {
          this.httpService.createHoliday(this.merchantHoliday).pipe().subscribe(
            (response) => {
              loading.then(l => l.dismiss());
              if (response && response.status === 'SUCCESS') {
                if (response.data) {
                  this.nav.GoBackTo('/holidaylist');
                  this.sharedService.changeHolidayList(1);
                }
                else {
                  this.toast.showToast('Failed to create holiday');
                }
              }
              resolve(1);
            },
            (error) => {
              loading.then(l => l.dismiss());
              this.toast.showToast('Something went wrong. Please try again');
              reject(1);
            }
          );
        });
      }
    }
  }

  onRepeatModeChange() {
    this.merchantHoliday.startDay = null;
    this.merchantHoliday.endDay = null;
    this.merchantHoliday.startDate = null;
    this.merchantHoliday.endDate = null;

    if (this.repeatmode.value !== 'weeklymulti') {
      for (const day of this.repeatdays) {
        day.isSelected = false;
      }
    }

    if (this.repeatmode.value === 'monthlysingle') {
      this.holidayForm.get('monthlySingleStartDate').enable();
    }
    else {
      this.holidayForm.get('monthlySingleStartDate').disable();
    }

    if (this.repeatmode.value === 'monthlymulti') {
      this.holidayForm.get('monthlyMultiStartDate').enable();
      this.holidayForm.get('monthlyMultiEndDate').enable();
    }
    else {
      this.holidayForm.get('monthlyMultiStartDate').disable();
      this.holidayForm.get('monthlyMultiEndDate').disable();
    }

    if (this.repeatmode.value === 'yearly') {
      this.holidayForm.get('yearlyStartDate').enable();
    }
    else {
      this.holidayForm.get('yearlyStartDate').disable();
    }

    if (this.repeatmode.value === 'yearlymulti') {
      this.holidayForm.get('yearlyMultiStartDate').enable();
      this.holidayForm.get('yearlyMultiEndDate').enable();
    }
    else {
      this.holidayForm.get('yearlyMultiStartDate').disable();
      this.holidayForm.get('yearlyMultiEndDate').disable();
    }
  }

  holidayTypeChange() {
    if (this.merchantHoliday.holidayType === 'PLANNED') {
      this.holidayForm.get('UNStartDate').disable();
      this.holidayForm.get('UNMultiStartDate').disable();
      this.holidayForm.get('UNMultiEndDate').disable();
    }
    else {
      if (this.merchantHoliday.dateType === 'SINGLE') {
        this.holidayForm.get('UNStartDate').enable();
        this.holidayForm.get('UNMultiStartDate').disable();
        this.holidayForm.get('UNMultiEndDate').disable();
      }
      else {
        this.holidayForm.get('UNStartDate').disable();
        this.holidayForm.get('UNMultiStartDate').enable();
        this.holidayForm.get('UNMultiEndDate').enable();
      }
    }
  }

  ValidateHolidayForm() {
    if (this.merchantHoliday.holidayType === 'PLANNED') {

      if (this.repeatmode.value === 'weeklysingle') {
        return this.selectedIndex != null;
      }
      else if (this.repeatmode.value === 'weeklymulti') {
        return this.merchantHoliday.startDay != null && this.merchantHoliday.endDay != null
          && this.merchantHoliday.startDay < this.merchantHoliday.endDay;
      }
      else if (this.repeatmode.value === 'monthlymulti') {
        return this.holidayForm.value.monthlyMultiStartDate < this.holidayForm.value.monthlyMultiEndDate;
      }
      else if (this.repeatmode.value === 'yearlymulti') {
        return this.holidayForm.value.yearlyMultiStartDate < this.holidayForm.value.yearlyMultiEndDate;
      }
      else {
        return true;
      }
    }
    else if (this.merchantHoliday.holidayType === 'UNPLANNED') {
      if (this.merchantHoliday.dateType === 'MULTIPLE') {
        return this.holidayForm.value.UNMultiStartDate < this.holidayForm.value.UNMultiEndDate;
      }
      else {
        return true;
      }
    }
  }

  getMerchantHoliday(id: string): Promise<MerchantHoliday> {
    return new Promise((resolve, reject) => {
      this.httpService.getMerchantHoliday(id).pipe().subscribe(
        (response) => {
          if (response && response.status === 'SUCCESS') {
            resolve(response.data);
          }
          else {
            this.toast.showToast('Something went wrong. Please try again');
          }

        },
        (error) => {
          this.toast.showToast('Something went wrong. Please try again');
          reject(1);
        }
      );
    });
  }
}
