import { Component, OnInit } from '@angular/core';
import { StoreSlot } from '../storetimemgmt/StoreSlot.model';
import { LoadingController } from '@ionic/angular';
import { PermanentSlotService } from './permanentslots.service';
import { ToastService } from '../_services/toast.service';
import { SharedService } from '../_services/shared.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

import { DateService } from '../_services/date.service';

@Component({
  selector: 'app-permanentslots',
  templateUrl: './permanentslots.page.html',
  styleUrls: ['./permanentslots.page.scss'],
})
export class PermanentslotsPage implements OnInit {

  constructor(
    private loadingCtrl: LoadingController,
    private httpService: PermanentSlotService,
    private toast: ToastService,
    public router: Router,
    private dateService: DateService,
    private sharedService: SharedService,
  ) {
  }

  storeConfigList: StoreSlot[];
  upcomingSlots: StoreSlot[];

  currentSlot: StoreSlot = new StoreSlot();

  weekDayMapping = { 1: 'Sunday', 2: 'Monday', 3: 'Tuesday', 4: 'Wednesday', 5: 'Thursday', 6: 'Friday', 7: 'Saturday' };
  refreshSubscription = new Subject();

  async ngOnInit() {
    this.sharedService.currentSlotTimeManagementRefresh.pipe(takeUntil(this.refreshSubscription)).subscribe(async data => {
      await this.getMerchantSlots();
    });
  }

  tConvert(time) {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      time = time.slice(1);
      time[3] = +time[0] < 12 ? ' AM' : ' PM';
      time[0] = +time[0] % 12 || 12;
      time[0] = +time[0] < 10 ? '0' + time[0] : time[0];
    }
    return time.join('');
  }

  getMerchantSlots() {
    return new Promise((resolve, reject) => {
      const loading = this.loadingCtrl.create();
      loading.then(l => l.present());
      const slots = this.httpService.GetMerchantSlots().subscribe(
        (response) => {
          loading.then(l => l.dismiss());
          if (response && response.status === 'SUCCESS') {
            const currentDateStart = new Date(new Date().setHours(0, 0, 0, 0)); // 00.00.00
            const currentDateEnd = new Date(new Date().setHours(23, 59, 59, 0)); // 23.59.59
            // tslint:disable-next-line: no-shadowed-variable
            const slots = response.data;
            const upcompingArr = [];
            const histroyArr = [];
            for (const slot of slots) {
              // slot.isActive = (currentDate >= new Date(slot.startDate) && (!slot.endDate || currentDate <= new Date(slot.endDate)));
              // dateTimeObjFromMysqlDateTime-->new date
              const dbStart = this.dateTimeObjFromMysqlDateTime(slot.startDate + ' 00:00:00');
              const dbEnd = this.dateTimeObjFromMysqlDateTime(slot.endDate + ' 23:59:59');
              if (currentDateStart >= dbStart && (!slot.endDate || currentDateEnd <= dbEnd)) {
                this.currentSlot = slot;
                this.currentSlot.closingTime = slot.closingTime ? this.tConvert(slot.closingTime) : '';
                this.currentSlot.endDate = slot.endDate;
                this.currentSlot.merchantSlotId = slot.merchantSlotId;
                this.currentSlot.name = slot.name;
                this.currentSlot.openingTime = slot.openingTime ? this.tConvert(slot.openingTime) : '';
                this.currentSlot.startDate = slot.startDate;
              } else if (dbStart >= currentDateStart) {
                slot.openingTime = slot.openingTime ? this.tConvert(slot.openingTime) : '';
                slot.closingTime = slot.closingTime ? this.tConvert(slot.closingTime) : '';
                upcompingArr.push(slot);
              } else if (currentDateEnd >= dbEnd) {
                slot.openingTime = slot.openingTime ? this.tConvert(slot.openingTime) : '';
                slot.closingTime = slot.closingTime ? this.tConvert(slot.closingTime) : '';
                histroyArr.push(slot);
              }
            }
            this.upcomingSlots = upcompingArr;
            this.sharedService.changeSlotHistroy(histroyArr);
            this.storeConfigList = slots;
          }
          else {
            this.toast.showToast('Something went wrong, Please try again');
          }
          resolve(1);
        }, (error) => {
          this.toast.showToast('Something went wrong, Please try again');
          reject(1);
        });
    });
  }

  toggleDetails(slotObject) {
    slotObject.toggle = !slotObject.toggle;
  }

  navigate(item: StoreSlot) {

    const param = { type: 'permanent', data: item };
    this.router.navigateByUrl('/storetimecreate', { state: param });
  }

  doRefresh(refresher) {
    this.getMerchantSlots();
    refresher.target.complete();
  }
  // convert mysql datetime to js date obj
  dateTimeObjFromMysqlDateTime(str: string) {
    if (str) {
      const dateTimeArr = str.split(/[- :]/);
      const dateTimeObj = new Date(Number(dateTimeArr[0]), Number(dateTimeArr[1]) - 1, Number(dateTimeArr[2]), Number(dateTimeArr[3]), Number(dateTimeArr[4]), Number(dateTimeArr[5]));
      return dateTimeObj;
    } else { return null; }
  }
  ngOnDestroy() {
    this.refreshSubscription.next();
    this.refreshSubscription.unsubscribe();
  }
  getAMPM(time) {
    return this.dateService.timeConvert(time);
  }

}
