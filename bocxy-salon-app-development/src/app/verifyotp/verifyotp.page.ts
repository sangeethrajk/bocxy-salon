import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuController, NavController, LoadingController, AlertController } from "@ionic/angular";
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { AccountService } from '../_services/account.service';
import { DateService } from '../_services/date.service';
import { HardbackService } from '../_services/hardback.service';
import { SignupService } from '../signup/signup.service';
import { ToastService } from '../_services/toast.service';
import { Storage } from '@ionic/storage';
import { take } from 'rxjs/operators';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { SharedService } from '../_services/shared.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-verifyotp',
  templateUrl: './verifyotp.page.html',
  styleUrls: ['./verifyotp.page.scss'],
  providers: [Keyboard]
})
export class VerifyotpComponent implements OnInit {

  @ViewChild('ngTelInput')
  ngTelInput: ElementRef;
  isKeyboardHide = true;
  reqOTP = false;
  public onOtpForm: FormGroup;
  otp: number;
  otpError: boolean;
  verifyBtnEnable = true;
  resendOtpEnable: boolean;
  countryCode = 'in';
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
  mobileNo: any;
  roleCode: string;
  userData: any;
  accountNotExist: boolean;
  mobileNumErr: boolean;
  activeErr: boolean;
  passwordErr: boolean;
  inValidOtpError: boolean = false;
  accountError: boolean = false;
  loginType: any;

  constructor(
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public keyboard: Keyboard,
    private _location: Location,
    private accountService: AccountService,
    private signupService: SignupService,
    private storage: Storage,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    public dateService: DateService,
    private hardBackService: HardbackService,
    private alertCtrl: AlertController,
    private sharedService: SharedService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.onOtpForm = this.formBuilder.group({
      otp: [null, Validators.compose([
        Validators.required
      ])]
    });
    this.storage.get('loginType').then(data => {
      this.loginType = data;
    })
    this.storage.get('googlePlusData').then(data => {

      //for now set manually
      this.mobileNo = 8220893340;;
      this.userData = data;
      this.goToOtp();
    });
    // BackToExit
    this.hardBackService.backToExit();
  }

  goToOtp() {
    this.resendOtpEnable = false;
    this.otpError = false;
    this.timeLeft = 60;
    this.reqOTP = !this.reqOTP;
    this.startTimer();
    this.storage.get('dialCode').then((dialCode) => {
      this.storage.get('mobileNumber').then((mobileNumber) => {
        this.signupService.createAccount({
          mobileNo: "8220893340",
          dialCode: "+91",
          countryCode: this.countryCode,
          type: "USER"
        }).pipe(take(1))
          .subscribe(
            data => {
              if (data && data.status === 'SUCCESS') {
                this.verifyBtnEnable = true;
                this.storage.set('roleCode', data.data.roleCodes);
                this.roleCode = data.data.roleCodes;
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
      });
    });
  }

  verifyOtp() {

    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    this.storage.get('dialCode').then((dialCode) => {
      this.storage.get('mobileNumber').then((mobileNumber) => {
        const postData = {
          mobileNo: "8220893340",
          dialCode: "+91",
          Otp: this.otp
          //dialCode
        };
        this.signupService.verifyOtp(postData)
          .subscribe(
            data => {
              loading.then(l => l.dismiss());
              console.log(data, 'response data');
              if (data.data && data.data == true && data.status === 'SUCCESS') {
                this.otpError = false;
                this.pauseTimer();
                this.socialMediaRegister();
                //this.navCtrl.navigateRoot('/customer-info');
              } else {
                this.otpError = true;
              }
            }, err => {
              loading.then(l => l.dismiss());
            }
          );

      });
    });
  }

  socialMediaRegister() {
    const loading = this.loadingCtrl.create();
    this.accountNotExist = true;
    let registerPostData = {};
    if (this.loginType == 'facebook') {
      registerPostData = {
        /* mobileNo: this.userData.mobileNumber,
        dialCode: this.userData.dialCode,
        otp: this.otp,
        type: "FACEBOOK",
        authStatus: "Logged",
        accessToken: this.userData.accessToken,
        expiresIn: this.userData.expiresIn,
        userId: this.userData.userId,
        sessionKey: this.userData.sessionKey,
        gender: this.userData.gender,
        email: this.userData.email,
        fullName: this.userData.fullName,
        pictureUrl: this.userData.pictureUrl */
        mobileNo: "8220893340",
        dialCode: "+91",
        otp: this.otp,
        type: "FACEBOOK",
        authStatus: "Logged",
        accessToken: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        expiresIn: 143433466,
        userId: "55757748475",
        sessionKey: "zzzzzzzzzzzzzzzzzzzzzzzzzz",
        gender: "Female",
        email: "aaaaaa@bbb.ccc",
        fullName: "Natasha",
        pictureUrl: "https://facebook.com/aaa/bbb/ccc",
      }
    }
    else if (this.loginType == 'google') {
      registerPostData = {
        mobileNo: "8220893340",
        dialCode: "+91",
        otp: this.otp,
        type: "GOOGLE",
        accessToken: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        refreshToken: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        userId: "55757748475",
        server_auth_code: "zzzzzzzzzzzzzzzzzzzzzzzzzz",
        fullName: "Natasha",        // displayName
        email: "aaaaaa@bbb.ccc",
        familyName: "Natasha",
        givenName: "Natasha",
        pictureUrl: "https://facebook.com/aaa/bbb/ccc",
      }
    }

    loading.then(l => l.present());
    this.signupService.socialMediaRegister(registerPostData)
      .subscribe(
        async (response) => {
          if (response && response.status === 'SUCCESS') {
            this.sharedService.changeAuthTokenCheck(response.data.accessToken);
            await this.storage.set('accessToken', response.data.accessToken);
            const authVal = await this.authService.isLoggedIn();
            this.authService.getAccount().subscribe(async data => {
              if (response && response.status === 'SUCCESS') {
                // console.log("userd:"+this.storage.get('userData'));
                await this.storage.set('userData', data.data);
                await this.storage.set('firstLogin', response.data.firstlogValue);
                // await this.storage.set('currentLocation', {
                //   region: data.data.agencyRegion,
                //   latitude: data.data.latitude,
                //   longitude: data.data.longitude
                // });
                this.sharedService.changeLoginCheck(authVal);
                this.sharedService.changeProfileCheck(1);
                loading.then(l => l.dismiss());
                if (response.data.firstlogValue === 'Y') {
                  this.navCtrl.navigateRoot('/home');
                  this.storage.set('firstLogin', 'N');
                } else {
                  this.navCtrl.navigateRoot('/home');
                }
              }
            });
            this.mobileNumErr = false;
            this.activeErr = false;
            this.passwordErr = false;
          } else {
            loading.then(l => l.dismiss());
            if (response && response.data) {
              if (response.data.invalidOtp) {
                this.inValidOtpError = true;
              }
              else if (response.data.accountError) {
                this.accountError = true;
              }
              else {
                this.inValidOtpError = false;
                this.accountError = false;
                this.toast.showToast(response.data.message);
              }
            } else {
              this.toast.showToast();
            }
          }
        }, async err => {
          loading.then(l => l.dismiss());
          this.toast.showToast();
        }
      );
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

  resend() {
    this.timeLeft = 60;
    this.startTimer();
    this.resendOtpEnable = false;

    this.storage.get('dialCode').then((dialCode) => {
      this.storage.get('mobileNumber').then((mobileNumber) => {
        const postData = {
          mobileNo: "8220893340",
          countryCode: this.countryCode,
          dialCode: "+91"
        };
        this.signupService.otpresend(postData)
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
  previous() {
    this._location.back();
  }

}
