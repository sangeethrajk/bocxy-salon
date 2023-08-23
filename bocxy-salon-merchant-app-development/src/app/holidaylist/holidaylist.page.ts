import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Holiday } from './holidaylist.model';
import { HolidayListService } from './holidaylist.service';
import { ToastService } from '../_services/toast.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { SharedService } from '../_services/shared.service';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-holidaylist',
  templateUrl: './holidaylist.page.html',
  styleUrls: ['./holidaylist.page.scss'],
})
export class HolidaylistPage implements OnInit {

  constructor(
    private httpService: HolidayListService,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private nav: NavigationHandler,
    private alertController: AlertController,
    private sharedService: SharedService,
  ) {

  }
  holidayList: Holiday[];
  page: number;
  totalHolidayCount: number;
  totalPages: number;
  refreshSubscription = new Subject();

  async ngOnInit() {
    this.sharedService.currentholidayListReferesh.pipe(takeUntil(this.refreshSubscription)).subscribe(async data => {
      this.holidayList = [];
      this.page = 1;
      this.totalPages = 0;
      this.totalHolidayCount = 0;
      await this.getMerchantHolidays(this.page);
    });
  }

  getMerchantHolidays(page: number) {
    return new Promise((resolve, reject) => {
      const loading = this.loadingCtrl.create();
      loading.then(l => l.present());
      this.httpService.getMerchantHolidays(page).pipe().subscribe(
        (response) => {
          loading.then(l => l.dismiss());
          this.holidayList = this.holidayList.concat(response.data);
          this.totalPages = response.totalPages;
          this.totalHolidayCount = response.totalCount;
          resolve(1);
        },
        (error) => {
          loading.then(l => l.dismiss());
          this.toast.showToast('Something went wrong. Please try again');
          reject(error);
        });
    });
  }

  async loadMoreData(infiniteScroll) {
    this.page = this.page + 1;
    await this.getMerchantHolidays(this.page);
    infiniteScroll.target.complete();
  }

  async doRefresh(refresher) {
    this.page = 1;
    this.totalPages = 0;
    this.totalHolidayCount = 0;
    this.holidayList = [];
    await this.getMerchantHolidays(this.page).then(data => { refresher.target.complete(); })
      .catch(err => {
        refresher.target.complete();
      });
  }

  async presentDeleteAlertConfirm(holiday: Holiday, index: number) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete Holiday',
      message: 'Do you want to Delete the holiday?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: (no) => {
            console.log('Deletion Canceled!');
          },
        },
        {
          text: 'Yes',
          cssClass: 'secondary',
          handler: async () => {
            const loading = this.loadingCtrl.create();
            loading.then(l => l.present());
            this.httpService.deleteHoliday(holiday.merchantHolidayId).subscribe(
              (response) => {
                loading.then(l => l.dismiss());
                if (response && response.data && response.status === 'SUCCESS') {
                  this.holidayList.splice(index, 1);
                  if (this.holidayList.length === 0) {
                    this.totalHolidayCount = 0;
                  }
                }
                else {
                  this.toast.showToast('Failed to delete the holiday. Please try again later');
                }
              }
            );
          }
        }
      ],
    });

    await alert.present();
  }

  goBack(url: string) {
    this.nav.GoBackTo(url);
  }
  ngOnDestroy() {
    this.refreshSubscription.next();
    this.refreshSubscription.unsubscribe();
  }
}
