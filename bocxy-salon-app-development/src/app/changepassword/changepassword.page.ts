import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Storage } from '@ionic/storage';
import { ChangePasswordService } from './changepassword.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../_services/toast.service';
import { ToastController } from '@ionic/angular';
import { DateService } from '../_services/date.service';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
})
export class ChangepasswordPage implements OnInit {
  userData: any;
  resendOtpEnable: boolean;
  timeLeft = 0;
  interval: any;
  otpError: boolean;
  otp: any;
  // OTP Input
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '100px',
      height: '100px'
    }
  };
  verifyBtnEnable: boolean;
  passwordForm: FormGroup;
  patternPassword: boolean;
  compareConfirmPassword: boolean;
  mandatory: boolean;
  isTextFieldType: boolean;
  submitBtnEnable: boolean;
  showOtpBtn: boolean;

  constructor(private location: Location, private storage: Storage,
    private nav: NavigationHandler,
    private pwdService: ChangePasswordService,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private toastController: ToastController,
    public dateService: DateService,
    public translate: TranslateService,
    public TranslateModule: TranslateModule) { }

  async ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      password: [null, Validators.compose([Validators.required, Validators.pattern(/(?=.*?)(?=.*?[a-z])(?=.*?[0-9])(?=.*?).{6,}/)])],
      confirmPassword: [null, Validators.compose([Validators.required])]
    });

    this.userData = await this.storage.get('userData');
  }

  sendOtp() {
    this.timeLeft = 60;
    this.startTimer();
    this.resendOtpEnable = false;
    this.otpError = false;
    this.pwdService.sendProfileOtp().subscribe(response => {
      if (response.data && response.status == 'SUCCESS') {
        this.presentToast();
        this.resendOtpEnable = false;
        this.timeLeft = 60;
      }
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'OTP has been sent to your mobile number!',
      duration: 5000
    });
    toast.present();
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.pauseTimer();
        this.resendOtpEnable = true;
      }
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  resend() {
    this.timeLeft = 60;
    this.startTimer();
    this.resendOtpEnable = false;

    this.pwdService.sendProfileOtp()
      .subscribe(
        data => {
          console.log(data, 'response data');
          if (data.data && data.status === 'SUCCESS') {
            this.otpError = false;
            this.resendOtpEnable = false;
            this.timeLeft = 60;
          } else {
            this.otpError = true;
          }
        });
  }

  onOtpChange(otp) {
    console.log('otp:' + otp);
    this.otp = otp;
    if (otp.length != 4) {
      this.verifyBtnEnable = false;
    } else {
      this.verifyBtnEnable = true;
    }
  }

  verifyOtp() {
    const postData = {
      otp: this.otp
    };
    this.pwdService.profileVerifyOtp(postData)
      .subscribe(
        async data => {
          console.log(data, 'response data');
          if (data.data && data.data == true && data.status === 'SUCCESS') {
            this.otpError = false;
            const toast = await this.toastController.create({
              message: 'Otp Verified Successfully',
              duration: 5000
            });
            toast.present();
            this.pauseTimer();
            this.updatePassword();
          } else {
            this.otpError = true;
            this.verifyBtnEnable = false;
          }
        },
      );

  }

  comparePassword() {
    setTimeout(() => {
      console.log('password--', this.passwordForm.controls.password.value, this.passwordForm.controls.confirmPassword.value);
      if (this.passwordForm.controls.password.value) {
        if (this.passwordForm.controls.password.hasError('pattern')) {
          this.patternPassword = true;
          this.compareConfirmPassword = false;
          this.mandatory = false;
        } else {
          if (this.passwordForm.controls.confirmPassword.value) {

            if (!(this.passwordForm.controls.password.value === this.passwordForm.controls.confirmPassword.value)) {
              this.patternPassword = false;
              this.compareConfirmPassword = true;
              this.mandatory = false;
            } else {
              this.patternPassword = false;
              this.compareConfirmPassword = false;
              this.mandatory = false;
              this.submitBtnEnable = true;
            }
          } else {
            this.patternPassword = false;
            this.compareConfirmPassword = false;
            this.mandatory = true;
          }
        }
      } else {
        this.patternPassword = false;
        this.compareConfirmPassword = false;
        this.mandatory = true;
      }
    }, 0);
  }

  togglePasswordFieldType() {
    this.isTextFieldType = !this.isTextFieldType;
  }

  updatePassword() {
    const postData = {
      otp: this.otp,
      password: this.passwordForm.controls.password.value
    };
    if (this.patternPassword || this.compareConfirmPassword || this.mandatory) {
      return;
    }
    this.pwdService.profilePasswordUpdate(postData).subscribe(data => {
      if (data.data && data.status == 'SUCCESS') {
        console.log('Profile updated successfully');
        this.toast.showToast('Password Changed Successfully');
        this.nav.GoBackTo('/home/tabs/tab4');
      }
      else {
        console.log('Not updated');
      }
    });
  }

  doChangePassword() {
    if (!this.patternPassword && !this.compareConfirmPassword && !this.mandatory) {
      this.showOtpBtn = true;
      this.sendOtp();
    }
  }
  showChangePassword() {
    this.showOtpBtn = false;
  }
  gotoUrl(url: string) {
    this.nav.GoForward(url);
  }

  goBack(url: string) {
    this.nav.GoBackTo(url);
  }


  previous() {
    this.nav.GoBackTo('/home/tabs/tab4');
  }
}
