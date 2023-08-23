import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuController, NavController, LoadingController, AlertController } from "@ionic/angular";
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { AccountService } from '../_services/account.service';
import { DateService } from '../_services/date.service';
import { HardbackService } from '../_services/hardback.service';
import { SignupService } from './signup.service';
import { ToastService } from '../_services/toast.service';
import { Storage } from '@ionic/storage';
import { take } from 'rxjs/operators';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { SharedService } from '../_services/shared.service';
import { AuthService } from '../_services/auth.service';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.html',
  styleUrls: ['signup.scss'],
  providers: [Keyboard]
})
export class SignupComponent {

  @ViewChild('ngTelInput')
  ngTelInput: ElementRef;

  private signup: FormGroup;
  separateDialCode = true;
  reqOTP = false;
  isKeyboardHide = true;
  telInputOptions = { initialCountry: 'in', onlyCountries: ['in'] };
  mobileNumber: number;
  dialCode: string;
  countryCode = 'in';
  roleCode: string;
  public onSignUpForm: FormGroup;
  public onOtpForm: FormGroup;
  otp: number;
  showErr: boolean;
  exist: number;
  otpresendmessage: boolean;
  accountcreated: string;
  resendOtpEnable: boolean;
  formSubmitted: boolean;

  otpError: boolean;
  verifyBtnEnable = true;
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
  username: any;
  mobileNumErr: boolean;
  activeErr: boolean;
  passwordErr: boolean;
  isLoggedIn: boolean;
  lang: any;
  constructor(public menuCtrl: MenuController,
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
    private googlePlus: GooglePlus,
    private alertCtrl: AlertController,
    private sharedService: SharedService,
    private authService: AuthService,
    private fb: Facebook,
    public translate: TranslateService,
    public TranslateModule: TranslateModule
  ) {
    fb.getLoginStatus()
      .then(res => {
        console.log(res.status);
        if (res.status === 'connect') {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log(e));

    this.lang = 'en';
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  switchLanguage() {
    this.translate.use(this.lang);
    console.log(this.lang);

  }
  ngOnInit() {
    this.onSignUpForm = this.formBuilder.group({
      mobileNumber: [null, Validators.compose([
        Validators.required
      ])],
    });
    this.onOtpForm = this.formBuilder.group({
      otp: [null, Validators.compose([
        Validators.required
      ])]
    });
    // BackToExit
    this.hardBackService.backToExit();
  }

  fbLogin() {
    this.storage.set('loginType', 'facebook');
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then(async res => {
        if (res.status === 'connected') {
          this.isLoggedIn = true;
          this.getUserDetail(res.authResponse);

        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(async e => {
        // comment this static call
        let facebookLoginData = {
          type: "FACEBOOK",
          authStatus: "Logged",
          accessToken: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
          expiresIn: 143433466,
          userId: "55757748475",
          sessionKey: "zzzzzzzzzzzzzzzzzzzzzzzzzz",
          gender: "Female",
          email: "aaaaaa@bbb.ccc",
          fullName: "Natasha",
          pictureUrl: "https://facebook.com/aaa/bbb/ccc"
        }
        const loading = await this.loadingCtrl.create({
          message: 'Please wait...'
        });
        this.socialMedaiLogin(facebookLoginData, loading);

        ////


        console.log('Error logging into Facebook', e)
      });
  }

  async getUserDetail(authResponse: any) {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);
    this.fb.api('/' + authResponse.userid + '/?fields=id,email,name,gender,picture', ['public_profile'])
      .then(async res => {
        /* const alert = await this.alertCtrl.create({
          header: 'Info!',
          message: res,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary'
            }, {
              text: 'Okay',
              handler: () => {
                this.navCtrl.navigateRoot('/signup');
              }
            }
          ]
        });
        await alert.present(); */
        let facebookLoginData = {
          type: "FACEBOOK",
          authStatus: "Logged",
          accessToken: authResponse.accessToken,
          expiresIn: authResponse.expiresIn,
          userId: authResponse.userID,
          sessionKey: authResponse.session_key,
          gender: res['gender'],
          email: res['email'],
          fullName: res['name'],
          pictureUrl: res['picture'],
        }
        this.storage.set('googlePlusData', facebookLoginData);
        this.socialMedaiLogin(facebookLoginData, loading);
        console.log(res);
        //this.users = res;
      })
      .catch(async e => {

        /* const alert = await this.alertCtrl.create({
          header: 'Info!',
          message: e,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary'
            }, {
              text: 'Okay',
              handler: () => {
                this.navCtrl.navigateRoot('/signup');
              }
            }
          ]
        });
        await alert.present(); */
        console.log(e);
      });
  }

  sendOtp() {
    this.pauseTimer();
    this.reqOTP = !this.reqOTP;
  }

  gotoLogin() {
    this.navCtrl.navigateRoot('/login');
  }

  hasError(obj) {
    if (!this.onSignUpForm.get('mobileNumber').getError('required')) {
      if (!obj) {
        this.onSignUpForm.get('mobileNumber').setErrors({ invalid_cell_phone: true });
      }
    }
  }

  getNumber(obj) {
    this.mobileNumber = this.onSignUpForm.value.mobileNumber ? typeof (this.onSignUpForm.value.mobileNumber) === "number" ? this.onSignUpForm.value.mobileNumber : Number((this.onSignUpForm.value.mobileNumber).replace(' ', '')) : null;
    // this.mobileNumber = Number(this.onSignUpForm.value.mobileNumber);
    const n = obj.indexOf(this.mobileNumber);
    this.dialCode = obj.substr(0, n);
    this.ismobbilenumberunique({ mobileNo: this.mobileNumber, dialCode: this.dialCode }).then((res: any) => {
      if (res && res.notExist === true) {
        this.exist = 2;
      } else {
        this.exist = 1;
        // this.exist = 2;
      }
    });
  }

  onCountryChange(obj) {
    this.countryCode = obj.iso2;
  }

  telInputObject(obj) {
    obj.setCountry(this.countryCode);
  }

  changePhone() {
    this.exist = 0;
    this.ngTelInput.nativeElement.blur();
    this.ngTelInput.nativeElement.focus();
  }

  numberValidate(evt) {
    const theEvent = evt || window.event;
    let key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    const regex = /[0-9]/;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) {
        theEvent.preventDefault();
      }
    }
  }

  pauseTimer() {
    clearInterval(this.interval);
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

  ismobbilenumberunique(value: any) {
    const q = new Promise((resolve, reject) => {
      this.accountService.checkExists(value).pipe(take(1)).subscribe(data => {
        if (data && (data.status === 'SUCCESS' && data.data === false)) {
          resolve({ notExist: true });
        } else {
          resolve(null);
        }
      }, err => {
        resolve(null);
      });
      // }, 100);
    });
    return q;
  }

  goToOtp() {
    //this.navCtrl.navigateRoot('/customer-info');
    this.formSubmitted = true;
    this.resendOtpEnable = false;
    this.otpError = false;
    this.timeLeft = 60;
    console.log(this.exist);
    if (this.onSignUpForm.invalid || this.exist !== 2) {
      return;
    }
    this.reqOTP = !this.reqOTP;
    this.startTimer();
    const mobileNumber = this.mobileNumber;
    this.storage.set('mobileNumber', mobileNumber);
    this.storage.set('dialCode', this.dialCode);
    this.signupService.createAccount({
      mobileNo: mobileNumber,
      dialCode: this.dialCode,
      countryCode: this.countryCode,
      type: "USER"
    }).pipe(take(1))
      .subscribe(
        data => {
          if (data && data.status === 'SUCCESS') {
            // this.onSignUpForm.reset();            
            this.verifyBtnEnable = true;
            this.storage.set('roleCode', data.data.roleCodes);
            this.roleCode = data.data.roleCodes;

            // this.navCtrl.navigateRoot('/merchant-info');

            // this.exist = 0;
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


  verifyOtp() {

    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    this.storage.get('dialCode').then((dialCode) => {
      this.storage.get('mobileNumber').then((mobileNumber) => {
        const postData = {
          mobileNo: mobileNumber,
          Otp: this.otp,
          dialCode
        };
        this.signupService.verifyOtp(postData)
          .subscribe(
            data => {
              loading.then(l => l.dismiss());
              console.log(data, 'response data');
              if (data.data && data.data == true && data.status === 'SUCCESS') {
                this.otpError = false;
                this.pauseTimer();
                this.navCtrl.navigateRoot('/customer-info');
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

  resend() {
    this.timeLeft = 60;
    this.startTimer();
    this.resendOtpEnable = false;

    this.storage.get('dialCode').then((dialCode) => {
      this.storage.get('mobileNumber').then((mobileNumber) => {
        const postData = {
          mobileNo: mobileNumber,
          countryCode: this.countryCode,
          dialCode
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

  onOtpChange(otp) {
    this.otp = otp;
    if (otp.length >= 4) {
      this.verifyBtnEnable = false;
    } else {
      this.verifyBtnEnable = true;
    }
  }

  async doGoogleLogin() {
    this.storage.set('loginType', 'google');
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    this.googlePlus.login({
      'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '678773207033-hu8qvdu5ku7qhsk3uu56hkocljiiudkc.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
    })
      .then(async user => {
        loading.dismiss();
        //set google response data
        user.mobileNumber = 8220893340;
        user.dialCode = +91;
        this.storage.set('googlePlusData', user);
        this.storage.set('mobileNumber', user.mobileNumber);
        this.storage.set('dialCode', user.dialCode);
        this.username = user + "success";
        /* const alert = await this.alertCtrl.create({
          header: 'Info!',
          message: user,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary'
            }, {
              text: 'Okay',
              handler: () => {
                this.navCtrl.navigateRoot('/signup');
              }
            }
          ]
        });
        await alert.present(); */
        let loginPostData = {
          type: "GOOGLE",
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          userId: user.userId,
          server_auth_code: "zzzzzzzzzzzzzzzzzzzzzzzzzz",
          fullName: user.displayName,        // displayName
          email: user.email,
          familyName: user.familyName,
          givenName: user.givenName,
          pictureUrl: user.imageUrl,
        }
        this.presentLoading(loading);
        this.socialMedaiLogin(loginPostData, loading);
        loading.dismiss();
      }, async err => {
        let loginPostData = {
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
        this.socialMedaiLogin(loginPostData, loading);
        //this.navCtrl.navigateRoot('/signup');
        console.log(err);
        this.username = err + 'error';
        loading.dismiss();
      });
  }

  socialMedaiLogin(loginPostData, loading) {
    this.signupService.socialMediaLogin(loginPostData)
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
                loading.dismiss();
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
            loading.dismiss();
            this.navCtrl.navigateRoot('/verifyotp');
            if (response) {
              //this.socialMediaRegister(user, loading);
            } else {
              this.toast.showToast();
            }
          }
        }, async err => {
          loading.dismiss();
          this.toast.showToast();
        }
      );
  }



  async presentLoading(loading) {
    return await loading.present();
  }

  async partialSignupPrompt() {
    const alert = await this.alertCtrl.create({
      header: 'Info!',
      message: 'Partial signup detected on this account! Please signup again.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Okay',
          handler: () => {
            this.navCtrl.navigateRoot('/signup');
          }
        }
      ]
    });
    await alert.present();
  }

  previous() {
    this._location.back();
  }

  goToHome() {
    this.navCtrl.navigateRoot('/home/tabs/tab1')
  }
}
