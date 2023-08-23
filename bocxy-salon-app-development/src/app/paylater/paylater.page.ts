import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PaylaterService } from './paylater.service';
import { AppointmentDetails } from './paylater.model';
import { ToastService } from '../_services/toast.service';
import { NavController, LoadingController } from '@ionic/angular';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { DateService } from '../_services/date.service';

@Component({
  selector: 'app-paylater',
  templateUrl: './paylater.page.html',
  styleUrls: ['./paylater.page.scss'],
})
export class PaylaterPage implements OnInit {

  paramSubscription: Subscription;
  apppointmentId: number;
  appoinmentDetails: AppointmentDetails;
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(
    private location: Location,
    public route: ActivatedRoute,
    private httpService: PaylaterService,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private nav: NavigationHandler,
    private dateService: DateService
  ) { }

  async ngOnInit() {
    this.appoinmentDetails = new AppointmentDetails();
    this.paramSubscription = this.route.params.subscribe(
      async (params: Params) => {
        // tslint:disable-next-line: no-string-literal
        if (params['appointmentId']) {
          this.apppointmentId = params.appointmentId;
          await this.getAppointmentDetails();
        }
      });
  }

  goBack(url: string) {
    this.nav.GoBackTo(url);
  }

  getAppointmentDetails() {
    return new Promise((resolve, reject) => {
      const loading = this.loadingCtrl.create();
      loading.then(l => l.present());
      this.httpService.getAppointmentDetails(this.apppointmentId).pipe().subscribe(
        (response) => {
          loading.then(l => l.dismiss());
          if (response && response.status === 'SUCCESS') {
            this.appoinmentDetails = response.data;
            const bookingDateStr = this.appoinmentDetails.bookingDate + " 00:00:00";
            const bookingDateArr = bookingDateStr.split(/[- :]/);
            const slortstartTimeObj = new Date(Number(bookingDateArr[0]), Number(bookingDateArr[1]) - 1, Number(bookingDateArr[2]), Number(bookingDateArr[3]), Number(bookingDateArr[4]), Number(bookingDateArr[5]));
            this.appoinmentDetails.bookingDateString = `${slortstartTimeObj.getDate()} ${this.months[slortstartTimeObj.getMonth()]} ${slortstartTimeObj.getFullYear()} ${this.dateService.timeConvert(this.appoinmentDetails.slotName)}, ${this.days[slortstartTimeObj.getDay()]}`;
          }
          else {
            this.toast.showToast('Something went wrong. Please try again');
          }
          resolve(1);
        },
        (error) => {
          this.toast.showToast('Something went wrong. Please try again');
          reject(1);
        }
      );
    });
  }
}
