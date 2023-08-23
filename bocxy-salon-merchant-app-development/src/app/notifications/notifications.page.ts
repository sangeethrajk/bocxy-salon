import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MerchantNotifications } from './notifications.model';
import { LoadingController, MenuController, NavController } from '@ionic/angular';
import { ToastService } from '../_services/toast.service';
import { merchantNotificationService } from './notfications.service';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { take } from 'rxjs/operators';
import { SharedService } from '../_services/shared.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notficationList: MerchantNotifications[];
  page: number;
  totalNotficationsCount: number;
  totalPages: number;
  constructor(
    private location: Location,
    private Cservice: merchantNotificationService,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    private nav: NavigationHandler,
    private toast: ToastService,
    private sharedService: SharedService,
    private loadingctrl: LoadingController
  ) { }

  async ngOnInit() {
    this.page = 1;
    await this.getNotifications(this.page);
    await this.getNotificationsCount();
  }
  getNotificationsCount() {
    const loading = this.loadingctrl.create();
    loading.then((l) => l.present());
    return new Promise((resolve, reject) => {
      this.Cservice
        .getNotficationsCount()
        .pipe(take(1))
        .subscribe(
          (response) => {
            loading.then((l) => l.dismiss());
            if (response && response.status === 'SUCCESS') {
              this.totalNotficationsCount = response.data.count;
            } else {
              this.toast.showToast('Something went wrong. Please try again');
            }
            resolve(1);
          },
          (error) => {
            this.toast.showToast('Something went wrong. Please try again');
            reject(error);
          }
        );
    });
  }
  getNotifications(page: number) {
    const loading = this.loadingctrl.create();
    loading.then((l) => l.present());
    return new Promise((resolve, reject) => {
      this.Cservice
        .getNotfications(page)
        .pipe(take(1))
        .subscribe(
          (response) => {
            loading.then((l) => l.dismiss());
            if (response && response.status === 'SUCCESS') {
              this.notficationList = response.data;
              this.totalPages = response.totalPages;
            } else {
              this.toast.showToast('Something went wrong. Please try again');
            }
            resolve(1);
          },
          (error) => {
            this.toast.showToast('Something went wrong. Please try again');
            reject(error);
          }
        );
    });
  }
  previous() {
    this.nav.GoBackTo('/home/tabs/tab1');
  }
  loadMoreData(infiniteScroll) {
    this.page = this.page + 1;
    this.getNotifications(this.page)
      .catch(error => { infiniteScroll.target.complete(); });
  }
  doRefresh(refresher) {
    this.getNotificationsCount();
    this.getNotifications(this.page);
    refresher.target.complete();
  }
  gotToAppointment(id, read, appId) {
    if (read === 'N') {
      this.updateNotificationsServices(id);
    }
    this.navCtrl.navigateRoot('/detailappointment/' + appId);
    // this.toast.showToast("Under Development");
  }
  updateNotificationsServices(id: number) {
    return new Promise((resolve, reject) => {
      this.Cservice
        .updateNotficationsFlag(id)
        .pipe(take(1))
        .subscribe(
          (response) => {
            resolve(1);
          },
          (error) => {
            this.toast.showToast('Failed to make the notification read');
            reject(error);
          }
        );
    });

  }
}
