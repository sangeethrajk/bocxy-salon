import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, LoadingController } from '@ionic/angular';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ForgotPasswordService } from '../forgotpw/forgotpw.service';
import { ToastService } from '../_services/toast.service';
import { Storage } from '@ionic/storage';
import { DateService } from '../_services/date.service';

@Component({
  selector: 'app-recoveryotp',
  templateUrl: './recoveryotp.page.html',
  styleUrls: ['./recoveryotp.page.scss'],
  providers: [Keyboard]
})
export class RecoveryotpComponent implements OnInit {
  isKeyboardHide = true;
  public onOtpForm: FormGroup;
  otp: number;
  otpError: boolean;
  verifyBtnEnable = true;
  otpresendmessage: boolean;
  resendOtpEnable: boolean;
  // OTP timer model
  timeLeft = 60;
  interval;
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

  constructor(
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private _location: Location,
    public keyboard: Keyboard,
    private forgotPasswordService: ForgotPasswordService,
    private storage: Storage,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    public dateService: DateService
  ) { }

  ionViewWillEnter() {
    // the left menu should be disabled on the login page
    this.menuCtrl.enable(false);

    this.keyboard.onKeyboardWillShow().subscribe(() => {
      this.isKeyboardHide = false;
      // console.log('SHOWK');
    });

    this.keyboard.onKeyboardWillHide().subscribe(() => {
      this.isKeyboardHide = true;
      // console.log('HIDEK');
    });
  }
  ionViewWillLeave() {
    // enable the left menu when leaving the login page
    this.menuCtrl.enable(true);
  }
  ngOnInit() {
    this.onOtpForm = this.formBuilder.group({
      otp: [null, Validators.compose([
        Validators.required
      ])]
    });
    this.startTimer();
  }
  verifyOtp() {
    this.storage.get('dialCode').then((dialCode) => {
      this.storage.get('mobileNumber').then((mobileNumber) => {
        const postData = {
          mobileNo: mobileNumber,
          Otp: this.otp,
          dialCode
        };
        this.forgotPasswordService.verifyOtp(postData)
          .subscribe(
            data => {
              console.log(data, 'response data');
              if (data.data && data.status === 'SUCCESS') {
                this.otpError = false;
                this.pauseTimer();
                this.navCtrl.navigateRoot('/updatepw');
              } else {
                this.otpError = true;
              }
            },
          );

      });
    });
  }

  resend() {
    this.timeLeft = 60;
    this.startTimer();
    this.resendOtpEnable = false;

    this.storage.get('dialCode').then((dialCode) => {
      this.storage.get('mobileNumber').then((mobileNumber) => {
        const postData = {
          mobileNo: mobileNumber,
          dialCode
        };
        this.forgotPasswordService.otpresend(postData)
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
            },
          );

      });
    });
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
  onOtpChange(otp) {
    this.otp = otp;
    if (otp.length >= 4) {
      this.verifyBtnEnable = false;
    } else {
      this.verifyBtnEnable = true;
    }

  }

  previous() {
    this._location.back();
  }
}
