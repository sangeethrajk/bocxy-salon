import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AppointmentDetail } from './detailappointment.model';
import { DetailAppointmentService } from './detailappointment.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastService } from '../_services/toast.service';
import { DateService } from '../_services/date.service';
import { NavigationHandler } from '../_services/navigation-handler.service';

@Component({
  selector: 'app-detailappointment',
  templateUrl: './detailappointment.page.html',
  styleUrls: ['./detailappointment.page.scss'],
})
export class DetailappointmentPage implements OnInit {

  paramSubscription: Subscription;
  appointment: AppointmentDetail;

  constructor(
    private location: Location,
    public alertController: AlertController,
    private httpService: DetailAppointmentService,
    public route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private toast: ToastService,
    public translate: TranslateService,
    public TranslateModule: TranslateModule,
    public dateService: DateService,
    private nav: NavigationHandler
  ) { }

  ngOnInit() {
    this.paramSubscription = this.route.params.subscribe(
      async (params: Params) => {
        // tslint:disable-next-line: no-string-literal
        if (params['appointmentId']) {
          const loading = this.loadingCtrl.create();
          loading.then((l) => l.present());
          this.httpService.getAppointmentDetails(Number(params['appointmentId'])).subscribe((response) => {
            loading.then((l) => l.dismiss());
            if (response && response.status === 'SUCCESS') {
              this.appointment = response.data;
            }
            else {
              this.toast.showToast('Something went wrong plesase try again');
            }
          });
        }
        else {
          this.toast.showToast('Something went wrong. Please try again');
        }
      });
  }

  async cancelAlert() {
    const alert = await this.alertController.create({
      cssClass: 'appointment-cancel-alert',
      header: 'Confirm!',
      message: 'Appintment will be cancelled. do you want to cancel it anyway?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'cancel-btn',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          cssClass: 'ok-btn',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  previous() {
    this.nav.GoBackTo('/home/tabs/tab3');
  }
}