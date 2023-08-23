import { Component, OnInit } from '@angular/core';
import { BookingService } from './tab3.service';
import { Appointments } from './tab3.model';
import { take } from 'rxjs/operators';
import { DateService } from '../_services/date.service';
import { AlertController } from '@ionic/angular';

import {
  LoadingController
} from '@ionic/angular';
import { ToastService } from '../_services/toast.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NavigationHandler } from '../_services/navigation-handler.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  appointmentsList: Appointments[] = [];
  page: number;
  totalAppointmentCount: number;
  totalPages: number;

  constructor(
    private bookingService: BookingService,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    public dateService: DateService,
    public alertController: AlertController,
    public translate: TranslateService,
    public TranslateModule: TranslateModule,
    private nav: NavigationHandler
  ) {
    // this.sharedService.currentgradeManagmentRefresh.subscribe(async (data) => {
    //   if (data) {
    //     this.manualRefresh();
    //   }
    // });
  }


  manualRefresh() {
    this.page = 1;
    this.getAppointments();
  }


  getAppointments() {
    const loading = this.loadingCtrl.create();
    loading.then((l) => l.present());
    this.appointmentsList = [];
    return new Promise((resolve, reject) => {
      this.bookingService
        .getCustomerAppointments()
        .pipe(take(1))
        .subscribe(
          (response) => {
            loading.then((l) => l.dismiss());
            if (response && response.status === 'SUCCESS') {
              this.appointmentsList = response.data;
              if (this.appointmentsList) {
                this.totalAppointmentCount = this.appointmentsList.length;
              }
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

  doRefresh(refresher) {
    this.page = 1;
    this.totalPages = 0;
    this.totalAppointmentCount = 0;
    this.appointmentsList = [];
    this.getAppointments().then(data => {
      refresher.target.complete();
    }).catch(err => {
      refresher.target.complete();
    });
  }

  loadMoreData(infiniteScroll) {
    this.page = this.page + 1;
    this.getAppointments().then(data => {
      infiniteScroll.target.complete();
      if (this.appointmentsList.length >= this.totalAppointmentCount) {
        infiniteScroll.target.disabled = true;
      }
    }).catch(error => { infiniteScroll.target.complete(); });
  }

  async ngOnInit() {
    this.manualRefresh();
  }
  async bookingPolicy() {
    const alert = await this.alertController.create({
      cssClass: 'booking-policy-alert',
      header: 'Booking Policy!',
      message: 'A grace time of 15mins will be allowed for unforeseen delays, after which the appointments may be cancelled or moved to the next available appointments.',
      buttons: ['OK']
    });

    await alert.present();
  }
  goTo(url: string) {
    this.nav.GoForward(url);
  }
}
