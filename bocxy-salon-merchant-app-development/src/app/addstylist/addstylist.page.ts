import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Keyboard } from '@ionic-native/keyboard/ngx';

import {
  StylistDetails,
  ProfessionList,
  ProfessionGrade
} from './addstylist.model';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Ng2TelInput } from 'ng2-tel-input';
import { AddStylistService } from './addstylist.service';
import { ToastService } from '../_services/toast.service';
import { LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute, Params, ROUTER_CONFIGURATION } from '@angular/router';
import { take } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { SharedService } from '../_services/shared.service';

@Component({
  selector: 'app-addstylist',
  templateUrl: './addstylist.page.html',
  styleUrls: ['./addstylist.page.scss'],
  providers: [Keyboard]
})
export class AddstylistPage implements OnInit {

  @ViewChild('ngTelInput')
  ngTelInput: ElementRef;
  telInputOptions = { initialCountry: 'in', onlyCountries: ['in'] };
  telObj: any;
  mobileNumber: number;
  dialCode: string;
  countryCode = 'in';
  exist: number;
  showDisable = false;
  paramSubscription: Subscription;
  accountId: number;
  editData: StylistDetails;
  professions: ProfessionList[];
  professionsGrade: ProfessionGrade[];
  stylistForm: FormGroup;
  formSubmitted: boolean;
  stylistVisbility: boolean;
  checkbox: boolean;
  title: boolean;
  isKeyboardHide = true;

  customActionSheetOptions: any = {
    header: 'Stylist Professions'
  };

  constructor(
    private _location: Location,
    private formBuilder: FormBuilder,
    private addStylistService: AddStylistService,
    private toast: ToastService,
    private loadingctrl: LoadingController,
    public route: ActivatedRoute,
    private navCtrl: NavController,
    private accountService: AccountService,
    private sharedService: SharedService,
    private nav: NavigationHandler,
    public keyboard: Keyboard
  ) { }

  async ngOnInit() {
    try {
      const loading = await this.loadingctrl.create({
        spinner: 'bubbles',
        message: 'Please wait...',
        cssClass: 'custom-spinner',
      });
      loading.present();
      await this.loadProfessions();
      await this.loadProfessionsGrade();
      this.paramSubscription = this.route.params.subscribe(
        async (params: Params) => {
          // tslint:disable-next-line: no-string-literal
          if (params['accountId']) {
            // tslint:disable-next-line: no-string-literal
            this.accountId = params['accountId'];
            await this.getEditData();
            this.countryCode = this.editData.mobileNoCountryCode;
            this.stylistForm = this.createForm();
            this.setTelInput();
            if (this.editData.roleCodes.includes('ST')) {
              this.stylistVisbility = true;
            }
            this.showDisable = this.editData.active === 'N' ? true : false;
            this.onChange();
            this.title = true;
            loading.dismiss();
          } else {

            this.stylistForm = this.createForm();
            this.onChange();
            loading.dismiss();
          }
        }
      );
    } catch (err) {
      console.log('something went wrong: ', err);
    }
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      professionId: [
        this.editData ? this.editData.professionId : null,
        Validators.compose([Validators.required]),
      ],
      professionistGradeId: [
        this.editData ? this.editData.professionistGradeId : null,
        Validators.compose([Validators.required]),
      ],
      firstName: [this.editData ? this.editData.firstName : null, Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-zA-Z_ ]*$/i),
      ])],
      mobileNo: [this.editData ? (this.editData.mobileNo) : null, Validators.compose([
        Validators.required,
      ])],
      email: [this.editData ? this.editData.email : null, Validators.compose([
        Validators.email,
      ])],
      address: [
        this.editData ? this.editData.address : null
      ],
      disable: [
        this.editData ? (this.editData.active === 'N' ? true : false) : false,
      ],
      showDisable: [
        null
      ],
      MG: [
        this.editData ? this.editData.roleCodes.includes('MG') ? true : false : false
      ],
      ST: [
        this.editData ? this.editData.roleCodes.includes('ST') ? true : false : false
      ],
    });
  }
  checkboxvalidator() {
    if (!this.stylistForm.value.ST && !this.stylistForm.value.MG) {
      this.checkbox = true;
    } else {
      this.checkbox = false;
    }
  }
  ismobbilenumberunique(value: { mobileNo: number, dialCode: string }) {
    const q = new Promise((resolve, reject) => {
      if (this.editData) {
        if (
          value.mobileNo === this.editData.mobileNo && value.dialCode === this.editData.mobileNoDialCode
        ) {
          resolve({ notExist: true });
        }
      }
      this.accountService.checkProfessionistExists(value).pipe(take(1)).subscribe(data => {
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
  getEditData() {
    return new Promise((resolve, reject) => {
      // this.editData = {
      //   accountId: 5,
      //   firstName: 'Loki',
      //   mobileNo: 7708325296,
      //   mobileNoDialCode: '+91',
      //   mobileNoCountryCode: 'in',
      //   roleId: 4,
      //   professionId: 1,
      //   roleCodes:["ST","MG"],
      //   roleCode:"st",
      //   email: "s",
      //   address: "asd",
      //   professionistGradeId:1
      // };
      // resolve(1);
      // return;

      this.addStylistService
        .getEditData(this.accountId)
        .pipe(take(1))
        .subscribe(
          (data) => {
            // console.log(data);
            if (data && data.status === 'SUCCESS') {
              this.editData = data.data;
            } else {
              this.toast.showToast('Something went wrong');
            }
            resolve(1);
          },
          (error) => {
            console.log(error);
            this.toast.showToast('Something went wrong');
            reject(error);
          }
        );
    });
  }
  onChange() {
    if (this.stylistForm.value.ST == false) {
      this.stylistVisbility = false;
      this.stylistForm.get('professionId').disable();
      this.stylistForm.get('professionistGradeId').disable();
    } else {
      this.stylistVisbility = true;
      this.stylistForm.get('professionId').enable();
      this.stylistForm.get('professionistGradeId').enable();

    }
  }
  loadProfessions() {
    return new Promise((resolve, reject) => {
      this.addStylistService
        .getProfessions()
        .pipe(take(1))
        .subscribe(
          (data) => {
            if (data && data.status === 'SUCCESS') {
              this.professions = data.data;
            } else {
              this.toast.showToast('Problem getting profession list');
            }
            resolve(1);
          },
          async (err) => {
            this.toast.showToast('Problem getting profession list');
            reject(err);
          }
        );
    });
  }
  loadProfessionsGrade() {
    return new Promise((resolve, reject) => {
      this.addStylistService
        .getProfessionsGrade()
        .pipe(take(1))
        .subscribe(
          (data) => {
            if (data && data.status === 'SUCCESS') {
              this.professionsGrade = data.data;
            } else {
              this.toast.showToast('Problem getting profession list');
            }
            resolve(1);
          },
          async (err) => {
            this.toast.showToast('Problem getting profession list');
            reject(err);
          }
        );
    });
  }

  formSubmit() {
    // console.log(this.stylistForm.value);
    this.checkboxvalidator();
    this.formSubmitted = true;

    if (!this.stylistForm.valid || this.exist !== 2) {
      return;
    }
    const formData: any = {
      // professionId: this.stylistForm.value.professionId ? this.stylistForm.value.professionId : 1,
      firstName: this.stylistForm.value.firstName.trim(),
      mobileNo: this.mobileNumber,
      dialCode: this.dialCode,
      countryCode: this.countryCode,
      email: this.stylistForm.value.email ? this.stylistForm.value.email : null,
      address: this.stylistForm.value.address ? this.stylistForm.value.address.trim() : null,
      // roleCode: 'ST'
    };
    if (this.stylistForm.value.disable) {
      formData.active = 'N';
    } else if (!this.stylistForm.value.disable) {
      formData.active = 'Y';
    }
    if (this.stylistForm.value.ST && this.stylistForm.value.MG) {
      formData.roleCodes = [
        this.stylistForm.value.ST ? 'ST' : null,
        this.stylistForm.value.MG ? 'MG' : null];
    } else if (this.stylistForm.value.ST) {
      formData.roleCodes = [
        this.stylistForm.value.ST ? 'ST' : null];
    } else if (this.stylistForm.value.MG) {
      formData.roleCodes = [
        this.stylistForm.value.MG ? 'MG' : null];
    }
    if (this.stylistVisbility == true) {
      formData.professionId = this.stylistForm.value.professionId ? this.stylistForm.value.professionId : 1;
      formData.professionistGradeId = this.stylistForm.value.professionistGradeId ? this.stylistForm.value.professionistGradeId : 1;
    }


    console.log(formData);

    if (this.editData) {
      console.log(formData);

      this.addStylistService
        .updateStylist(formData, this.accountId)
        .subscribe(
          (data) => {
            if (data && data.status === 'SUCCESS') {
              this.sharedService.changestyleManagmentRefresh(1);
              this.navCtrl.navigateRoot('/stylistmgmt');
              this.toast.showToast('Updated successfully');
            } else {
              this.toast.showToast('Problem updating account');
            }
          },
          async (err) => {
            this.toast.showToast('Problem updating account');
          }
        );
    } else {
      this.addStylistService.insertStylist(formData).subscribe(
        (data) => {
          if (data && data.status === 'SUCCESS') {
            this.sharedService.changestyleManagmentRefresh(1);
            this.navCtrl.navigateRoot('/stylistmgmt');
            this.toast.showToast('Added successfully');
          } else {
            this.toast.showToast('Problem creating account');
          }
        },
        async (err) => {
          this.toast.showToast('Problem creating account');
        }
      );
    }

  }
  hasError(obj) {
    if (!this.stylistForm.get('mobileNo').getError('required')) {
      if (!obj) {
        this.stylistForm.get('mobileNo').setErrors({ invalid_cell_phone: true });
      }
    }
  }
  getNumber(obj) {
    console.log(this.stylistForm.value.mobileNo);
    this.mobileNumber = this.stylistForm.value.mobileNo ? typeof (this.stylistForm.value.mobileNo) === 'number' ? this.stylistForm.value.mobileNo : Number((this.stylistForm.value.mobileNo).replace(' ', '')) : null;
    // this.mobileNumber = Number((this.stylistForm.value.mobileNo).replace(' ', ''));///////////
    const n = obj.indexOf(this.mobileNumber);
    this.dialCode = obj.substr(0, n);
    this.ismobbilenumberunique({ mobileNo: this.mobileNumber, dialCode: this.dialCode }).then((res: any) => {
      if (res && res.notExist === true) {
        this.exist = 2;
      } else {
        this.exist = 1;
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
  setTelInput() {
    setTimeout(() => {
      this.ngTelInput.nativeElement.focus();
      this.ngTelInput.nativeElement.blur();
      console.log(this.ngTelInput);

    }, 400);
  }
  gotoUrl(url: string) {
    this.nav.GoForward(url);
  }

  goBack(url: string) {
    this.nav.GoBackTo(url);
  }

  disableToggle() {
    if (this.showDisable) {
      this.stylistForm.get('showDisable').enable();
    } else {
      this.stylistForm.get('showDisable').disable();
    }
  }

  ionViewWillEnter() {
    this.keyboard.onKeyboardWillShow().subscribe(() => {
      this.isKeyboardHide = false;
      // console.log('SHOWK');
    });
    this.keyboard.onKeyboardWillHide().subscribe(() => {
      this.isKeyboardHide = true;
      // console.log('HIDEK');
    });
  }
}
