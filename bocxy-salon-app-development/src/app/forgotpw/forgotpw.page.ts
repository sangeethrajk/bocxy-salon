import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ForgotPasswordService } from './forgotpw.service';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forgotpw',
  templateUrl: './forgotpw.page.html',
  styleUrls: ['./forgotpw.page.scss'],
  providers: [Keyboard]
})
export class ForgotpwPage implements OnInit {
  @ViewChild('ngTelInput')
  ngTelInput: ElementRef;
  reqOTP = false;
  isKeyboardHide = true;
  telInputOptions = { initialCountry: 'in', onlyCountries: ['in'] };
  mobileNumber: number;
  dialCode: string;
  countryCode = 'in';

  public forgotForm: FormGroup;
  showErr: boolean;
  exist: number;
  otpresendmessage: boolean;
  accountcreated: string;
  resendOtpEnable: boolean;
  formSubmitted: boolean;

  private signup: FormGroup;
  separateDialCode = true;
  constructor(
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private _location: Location,
    public keyboard: Keyboard,
    private accountService: AccountService,
    private storage: Storage,
    private forgotPasswordService: ForgotPasswordService,
    public translate: TranslateService,
    public TranslateModule: TranslateModule
  ) { }

  sendOtp() {
    this.reqOTP = !this.reqOTP;
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

  ngOnInit() {
    this.forgotForm = this.formBuilder.group({
      mobileNumber: [null, Validators.compose([
        Validators.required
      ])],
    });
  }

  hasError(obj) {
    if (!this.forgotForm.get('mobileNumber').getError('required')) {
      if (!obj) {
        this.forgotForm.get('mobileNumber').setErrors({ invalid_cell_phone: true });
      }
    }
  }
  getNumber(obj) {
    this.mobileNumber = this.forgotForm.value.mobileNumber ? typeof (this.forgotForm.value.mobileNumber) === "number" ? this.forgotForm.value.mobileNumber : Number((this.forgotForm.value.mobileNumber).replace(' ', '')) : null;
    // this.mobileNumber = Number(this.forgotForm.value.mobileNumber);
    const n = obj.indexOf(this.mobileNumber);
    this.dialCode = obj.substr(0, n);
    this.ismobbilenumberunique({ mobileNo: this.mobileNumber, dialCode: this.dialCode }).then((res: any) => {
      if (res && res.exist === true) {
        this.exist = 2;
      } else {
        this.exist = 1;
        // this.exist = 2;
      }
    });
  }

  onCountryChange(obj) {
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

  ismobbilenumberunique(value: any) {
    const q = new Promise((resolve, reject) => {
      this.accountService.checkExists(value).pipe(take(1)).subscribe(data => {
        if (data && (data.status === 'SUCCESS' && data.data === true)) {
          resolve({ exist: true });
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

  goToNext() {
    this.formSubmitted = true;
    console.log(this.exist);
    if (this.forgotForm.invalid || this.exist !== 2) {
      return;
    }
    const mobileNumber = this.mobileNumber;
    this.storage.set('mobileNumber', mobileNumber);
    this.storage.set('dialCode', this.dialCode);
    this.navCtrl.navigateRoot('/recoveryoption');
  }

  previous() {
    this._location.back();
  }

}
