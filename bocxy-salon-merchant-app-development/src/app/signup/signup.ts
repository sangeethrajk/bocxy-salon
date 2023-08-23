import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuController, NavController, LoadingController } from '@ionic/angular';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SignupService } from './signup.service';
import { Storage } from '@ionic/storage';
import { ToastService } from '../_services/toast.service';
import { take } from 'rxjs/operators';
import { AccountService } from '../_services/account.service';
import { DateService } from '../_services/date.service';
import { HardBackService } from '../_services/hardback.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.html',
  styleUrls: ['signup.scss'],
  providers: [Keyboard]
})
export class SignupComponent implements OnInit {
  @ViewChild('ngTelInput')
  ngTelInput: ElementRef;
  reqOTP = false;
  isKeyboardHide = true;
  telInputOptions = { initialCountry: 'in', onlyCountries: ['in'] };
  mobileNumber: number;
  dialCode: string;
  countryCode = 'in';
  roleCodes: string[];
  lang: any;
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

  constructor(
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private _location: Location,
    public keyboard: Keyboard,
    private accountService: AccountService,
    private signupService: SignupService,
    private storage: Storage,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    public dateService: DateService,
    private hardBackService: HardBackService,
    public translate: TranslateService,
    public TranslateModule: TranslateModule
  ) {
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
    // this.hardBackService.backToExit();
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
      type: 'MERCHANT'
    }).pipe(take(1))
      .subscribe(
        data => {
          if (data && data.status === 'SUCCESS') {
            // this.onSignUpForm.reset();
            this.verifyBtnEnable = true;
            this.storage.set('roleCodes', data.data.roleCodes);
            this.roleCodes = data.data.roleCodes;

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
              if (data.data && data.data === true && data.status === 'SUCCESS') {
                this.otpError = false;
                this.pauseTimer();
                if (this.roleCodes && (this.roleCodes.includes('ST') || this.roleCodes.includes('MG'))) {
                  this.navCtrl.navigateRoot('/stylist-profile-complete');
                } else {
                  this.navCtrl.navigateRoot('/merchant-info');
                }
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
  } getNumber(obj) {

    this.mobileNumber = this.onSignUpForm.value.mobileNumber ? typeof (this.onSignUpForm.value.mobileNumber) === 'number' ? this.onSignUpForm.value.mobileNumber : Number((this.onSignUpForm.value.mobileNumber).replace(' ', '')) : null;

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
  // setVal(val) {
  //   this.ngOtpInput.setValue(val);
  // }
  goToHome() {
    this.navCtrl.navigateRoot('/home/tabs/tab1');
  }

  previous() {
    this._location.back();
  }
}
