import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { NavController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PaymentModeService } from './paymentmode.service';
import { ToastService } from '../_services/toast.service';
import { NavigationHandler } from '../_services/navigation-handler.service';

@Component({
  selector: 'app-paymentmode',
  templateUrl: './paymentmode.page.html',
  styleUrls: ['./paymentmode.page.scss'],
  providers: [Keyboard]
})
export class PaymentmodePage implements OnInit {
  payments = 'paylater';
  paramSubscription: Subscription;
  data: any;
  constructor(
    private location: Location,
    public keyboard: Keyboard,
    public navCtrl: NavController,
    public route: ActivatedRoute,
    public router: Router,
    public httpService: PaymentModeService,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private nav: NavigationHandler) { }

  ngOnInit() {
    const param = this.router.getCurrentNavigation().extras.state;
    this.data = param.data;
  }
  previous() {
    this.location.back();
  }

  onContinue() {
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    this.httpService.createAppointment(this.data).subscribe(
      (response) => {
        loading.then(l => l.dismiss());
        if (response && response.status === 'SUCCESS') {
          if (!response.data.bookedFlag) {
            this.navCtrl.navigateRoot(`/paylater/${response.data.appointmentId}`);
          }
          else {
            this.toast.showToast('Selected slot is already booked. Please select different slot');
          }
        }
        else {
          this.toast.showToast('Something went wrong. Please try again');
        }
      }
    );
  }

  goBack(url: string) {
    this.nav.GoBackTo(`/bookappointment/${url}`);
  }
}
