import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { MenuController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../_services/toast.service';
import { Storage } from '@ionic/storage';
import { AuthService } from '../_services/auth.service';
import { SharedService } from '../_services/shared.service';
import { AccountSecurityQuestions } from '../forgotpw/forgotpw.model';
import { AccountService } from '../_services/account.service';
import { HardBackService } from '../_services/hardback.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FcmService } from '../_services/fcm.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [Keyboard]
})
export class LoginPage implements OnInit {
  @ViewChild('ngTelInput')
  ngTelInput: ElementRef;
  isKeyboardHide = true;
  telInputOptions = { initialCountry: 'in', onlyCountries: ['in'] };
  mobileNumber: number;
  dialCode: string;
  countryCode = 'in';
  public loginForm: FormGroup;
  formSubmitted: boolean;
  mobileNumErr: boolean;
  activeErr: boolean;
  passwordErr: boolean;
  storeApproval: boolean;

  constructor(
    public keyboard: Keyboard,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private toast: ToastService,
    private storage: Storage,
    private authService: AuthService,
    private sharedService: SharedService,
    private alertCtrl: AlertController,
    private hardBackService: HardBackService,
    public translate: TranslateService,
    public translateModule: TranslateModule,
    private fcm: FcmService
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
    this.loginForm = this.formBuilder.group({
      mobileNumber: [null, Validators.compose([
        Validators.required
      ])],
      password: [null, Validators.compose([
        Validators.required
      ])],
    });

    // BackToExit
    // this.hardBackService.backToExit();
  }
  hasError(obj) {
    if (!this.loginForm.get('mobileNumber').getError('required')) {
      if (!obj) {
        this.loginForm.get('mobileNumber').setErrors({ invalid_cell_phone: true });
      }
    }
  }
  getNumber(obj) {
    this.mobileNumber = this.loginForm.value.mobileNumber ? typeof (this.loginForm.value.mobileNumber) === 'number' ? this.loginForm.value.mobileNumber : Number((this.loginForm.value.mobileNumber).replace(' ', '')) : null;
    // this.mobileNumber = Number(this.loginForm.value.mobileNumber);
    const n = obj.indexOf(this.mobileNumber);
    this.dialCode = obj.substr(0, n);
  }
  onCountryChange(obj) {
    this.countryCode = obj.iso2;
  }
  telInputObject(obj) {
    obj.setCountry(this.countryCode);
  }
  changePhone() {
    this.ngTelInput.nativeElement.blur();
    this.ngTelInput.nativeElement.focus();
    this.typeChange('mobileNum');
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
  typeChange(field: string) {
    if (field === 'mobileNum') {
      this.mobileNumErr = false;
      this.activeErr = false;
      this.storeApproval = false;
    }
    this.passwordErr = false;
  }
  login() {
    this.formSubmitted = true;
    if (this.loginForm.valid) {

      const loading = this.loadingCtrl.create();
      loading.then(l => l.present());
      const mobilenum = this.mobileNumber;
      const password = this.loginForm.value.password;
      console.log(mobilenum, password);

      this.authService.login(mobilenum, this.dialCode, password)
        .subscribe(
          async (response) => {
            if (response && response.status === 'SUCCESS') {
              this.sharedService.changeAuthTokenCheck(response.data.accessToken);
              await this.storage.set('accessToken', response.data.accessToken);
              const authVal = await this.authService.isLoggedIn();
              this.authService.getAccount().subscribe(async data => {
                if (response && response.status === 'SUCCESS') {
                  // let dummyVal: any = data.data;
                  // dummyVal.permissions = [  "APPOINTMENT_BILLING",
                  // "REVENUE_STATUS",
                  // "SERVICE_MANAGEMENT",
                  // "STYLIST_MANAGEMENT",
                  // "STYLIST_SLOT_CONFIGURATION",
                  // "BANNERS_MANAGEMENT",
                  // "STORE_TIME_MANAGEMENT",
                  // "CUSTOMER_MANAGEMENT",
                  // "EXPENSE_MANAGEMENT",
                  // "ANNOUNCEMENT_MANAGEMENT"];
                  // await this.storage.set('userData', dummyVal);
                  // console.log("userd:"+this.storage.get('userData'));
                  await this.storage.set('userData', data.data);
                  // await this.storage.set('currentLocation', {
                  //   region: data.data.agencyRegion,
                  //   latitude: data.data.latitude,
                  //   longitude: data.data.longitude
                  // });
                  this.sharedService.changeLoginCheck(authVal);
                  this.sharedService.changeProfileCheck(1);
                  this.fcm.getToken();
                  loading.then(l => l.dismiss());
                  if (data.data.roleCodes.includes('MR')) {
                    await this.storage.set('firstLogin', response.data.firstlogValue);
                    if (response.data.firstlogValue === 'Y') {
                      this.navCtrl.navigateRoot('/slotduration');
                    } else {
                      this.navCtrl.navigateRoot('/home');
                    }
                  } else {
                    await this.storage.set('firstLogin', 'N');
                    this.navCtrl.navigateRoot('/home');
                  }
                }
              });
              this.mobileNumErr = false;
              this.activeErr = false;
              this.passwordErr = false;
              this.storeApproval = false;
            } else {
              loading.then(l => l.dismiss());
              if (response) {
                if (response.data.username) {
                  this.mobileNumErr = true;
                } else if (response.data.signupFlag) {
                  this.partialSignupPrompt();
                } else if (response.data.activeFlag) {
                  this.activeErr = true;
                } else if (response.data.password) {
                  this.passwordErr = true;
                } else if (response.data.storeApproval) {
                  this.storeApproval = true;
                }

                // to be remove
                // if (response.data.activeFlag && response.data.password) {
                //   if (response.data.data === 'Account not exist') {
                //     this.mobileNumErr = true;
                //   } else {
                //     this.activeErr = true;
                //   }
                // } else if (response.data.password) {
                //   this.passwordErr = true;
                // } else {
                //   this.toast.showToast();
                // }
                // to be remove

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
}
