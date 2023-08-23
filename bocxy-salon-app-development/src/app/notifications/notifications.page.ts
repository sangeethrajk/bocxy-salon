import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CustomerNotifications } from './notifications.model';
import { LoadingController, MenuController, NavController } from '@ionic/angular';
import { ToastService } from '../_services/toast.service';
import { CustomerNotificationService } from './notfications.service';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { take } from 'rxjs/operators';
import { SharedService } from '../_services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notficationList: CustomerNotifications[];
  page: number;
  totalNotficationsCount: number;
  totalPages: number;
  constructor(
    private location: Location,
    private Cservice: CustomerNotificationService,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    private nav: NavigationHandler,
    private toast: ToastService,
    private sharedService: SharedService,
    private loadingctrl: LoadingController,
    public translate: TranslateService,
    public TranslateModule: TranslateModule

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
              console.log(response);

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
              console.log(this.notficationList);
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
    this.location.back();
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
    if (read === "N") {
      this.updateNotificationsServices(id);
    }
    this.navCtrl.navigateRoot('/detailappointment/' + appId);
    //this.toast.showToast("Under Development");
  }
  goToAnnoucement(id, read, annId) {
    if (read === "N") {
      this.updateNotificationsServices(id);
    }
    this.navCtrl.navigateRoot('/detailannouncement/' + annId);
    // this.navCtrl.navigateRoot('/home/tabs/tab3');
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
            this.toast.showToast('Something went wrong. Please try again');
            reject(error);
          }
        );
    });

  }
  dateFormat(date): string {
    // Split timestamp into [ Y, M, D, h, m, s ]
    let t = date.split(/[- :]/);

    let d = new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);
    function pad(s) {
      return s < 10 ? "0" + s : s;
    }
    let dateRes = [
      pad(d.getDate()),
      pad(d.getMonth() + 1),
      d.getFullYear(),
    ].join("/");
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    let strTime = dateRes + " " + pad(hours) + ":" + pad(minutes) + " " + ampm;
    return strTime;
  }

  gotoUrl(url: string) {
    this.nav.GoForward(url);
  }

  goBack(url: string) {
    this.nav.GoBackTo(url);
  }
}
