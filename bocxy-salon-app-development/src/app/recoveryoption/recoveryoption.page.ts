import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MenuController, NavController } from '@ionic/angular';
import { ForgotPasswordService } from '../forgotpw/forgotpw.service';
import { take } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { ToastService } from '../_services/toast.service';

@Component({
  selector: 'app-recoveryoption',
  templateUrl: './recoveryoption.page.html',
  styleUrls: ['./recoveryoption.page.scss'],
})
export class RecoveryoptionComponent implements OnInit {

  mobileNumber: number;
  dialCode: string;
  constructor(
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    private _location: Location,
    private forgotPasswordService: ForgotPasswordService,
    private storage: Storage,
    private toast: ToastService
  ) { }

  ionViewWillEnter() {
    // the left menu should be disabled on the login page
    this.menuCtrl.enable(false);
  }
  async ngOnInit() {
    this.mobileNumber = await this.storage.get('mobileNumber');
    this.dialCode = await this.storage.get('dialCode');
  }
  answerquestion() {
    this.navCtrl.navigateRoot('/answerquestion');
  }

  recoveryotp() {
    this.forgotPasswordService.sendOtp({
      mobileNumber: this.mobileNumber,
      dialCode: this.dialCode
    }).pipe(take(1))
      .subscribe(
        data => {
          if (data && data.status === 'SUCCESS') {
            this.navCtrl.navigateRoot('/recoveryotp');
          } else {
            if (!data) {
              this.toast.showToast();
            } else {
              this.toast.showToast('Account creation failed. Please try again');
            }
          }
        },
        error => this.toast.showToast()
      );

  }

  previous() {
    this._location.back();
  }
}
