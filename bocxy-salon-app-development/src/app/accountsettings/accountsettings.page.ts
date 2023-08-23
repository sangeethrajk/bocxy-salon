import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { AccountSettingsService } from './accountsettings.service';
import { AccountSettingsCustomer } from './accountSettings.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ToastService } from '../_services/toast.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { SharedService } from '../_services/shared.service';
import { GeoAddress } from '../_models/geo-address.model';
import { LocationsearchComponent } from '../locationsearch/locationsearch.component';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-accountsettings',
  templateUrl: './accountsettings.page.html',
  styleUrls: ['./accountsettings.page.scss'],
})
export class AccountsettingsPage implements OnInit {
  @ViewChild('ngTelInput')
  ngTelInput: ElementRef;
  selectedIcon: any;
  changeGender = false;
  genderIcons = [
    { id: '0', title: 'Male', name: 'assets/icon/male_icon.svg' },
    { id: '1', title: 'Female', name: 'assets/icon/female_icon.svg' },
  ];
  userData: any;
  accountSettingCSObject: AccountSettingsCustomer;
  telInputOptions = { initialCountry: 'in', onlyCountries: ['in'] };
  profileForm: FormGroup;
  mobileNumber: number;
  dialCode: string;
  exist: number;
  countryCode: any = 'in';
  formSubmitted: boolean;
  dataReturned: GeoAddress = new GeoAddress();

  constructor(
    private location: Location,
    private accountSettingService: AccountSettingsService,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private toast: ToastService,
    private loadingctrl: LoadingController,
    private sharedService: SharedService,
    public modalController: ModalController,
    private nav: NavigationHandler,
    public translate: TranslateService,
    public TranslateModule: TranslateModule
  ) { }

  async ngOnInit() {
    this.userData = await this.storage.get('userData');
    try {
      const loading = await this.loadingctrl.create({
        spinner: 'bubbles',
        message: 'Please wait...',
        cssClass: 'custom-spinner',
      });
      loading.present();

      if (this.userData && this.userData.roleCodes && this.userData.roleCodes.includes('CS')) {
        await this.accountSettingService.getCurrentUserAccountForCustomer().subscribe(data => {
          if (data.status === 'SUCCESS') {
            this.accountSettingCSObject = data.data;
            this.selectedIcon = this.accountSettingCSObject && this.accountSettingCSObject.pictureUrl ? this.accountSettingCSObject.pictureUrl : 'assets/icon/male_icon.svg';
            this.profileForm = this.createForm();
            loading.dismiss();
          }
        });
      }
    } catch (err) {
      console.log('something went wrong: ', err);
    }


    // this.setTelInput();
  }

  createForm(): FormGroup {
    let firstName, lastName, email, mobileNo, address;
    if (this.userData && this.userData.roleCodes && this.userData.roleCodes.includes('CS')) {
      firstName = this.accountSettingCSObject ? this.accountSettingCSObject.firstName : null;
      lastName = this.accountSettingCSObject ? this.accountSettingCSObject.lastName : null;
      email = this.accountSettingCSObject ? this.accountSettingCSObject.email : null;
      mobileNo = this.accountSettingCSObject ? this.accountSettingCSObject.mobileNo : null;
      address = this.accountSettingCSObject ? this.accountSettingCSObject.address : null;
    }
    this.dataReturned.address = address;
    return this.formBuilder.group({
      firstName: [firstName, Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-z]+( [a-z]+)*$/i),
      ])],
      mobileNo: [mobileNo, Validators.compose([])],
      address: [address, Validators.compose([
        Validators.required,
        Validators.pattern(/^(\w*\s*[\#\-\,\/\.\(\)\&]*)+/)
      ])],
      email: [email, Validators.compose([
        Validators.email,
      ])],

      lastName: [
        lastName, Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-z]+( [a-z]+)*$/i),
        ])
      ]
    });
  }

  hasError(obj) {
    if (this.profileForm.get('mobileNo').value != null && this.profileForm.get('mobileNo').value != '') {
      if (!obj) {
        this.profileForm.get('mobileNo').setErrors({ invalid_cell_phone: true });
      }
    }
  }

  ismobbilenumberunique(value: { mobileNo: number, dialCode: string }) {
    const q = new Promise((resolve, reject) => {
      if (this.userData && this.userData.roleCodes.includes('MR')) {
        if (this.accountSettingCSObject) {
          if (
            value.mobileNo === this.accountSettingCSObject.mobileNo && value.dialCode === this.accountSettingCSObject.dialCode
          ) {
            resolve({ notExist: true });
          }
        }
      }

      /* this.accountService.checkProfessionistExists(value).pipe(take(1)).subscribe(data => {
        if (data && (data.status === 'SUCCESS' && data.data === false)) {
          resolve({ notExist: true });
        } else {
          resolve(null);
        }
      }, err => {
        resolve(null);
      }); */
      // }, 100);
    });
    return q;
  }

  getNumber(obj) {
    console.log(this.profileForm.value.mobileNo);
    this.mobileNumber = this.profileForm.value.mobileNo ? typeof (this.profileForm.value.mobileNo) === 'number' ? this.profileForm.value.mobileNo : Number((this.profileForm.value.mobileNo).replace(' ', '')) : null;

    // this.mobileNumber = Number((this.profileForm.value.mobileNo).replace(' ', ''));
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

  telInputObject(obj) {
    obj.setCountry(this.countryCode);
  }

  onCountryChange(obj) {
    this.countryCode = obj.iso2;
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

  editGenderIcon() {
    this.changeGender = !this.changeGender;
  }
  getGender(icon) {
    this.selectedIcon = icon.name;
    console.log(this.selectedIcon);
    this.changeGender = !this.changeGender;
  }

  updateProfile() {
    let postData;
    this.formSubmitted = true;
    if (!this.profileForm.valid) {
      return;
    }
    console.log('form data:' + this.profileForm.value);
    if (this.userData && this.userData.roleCodes.includes('MR')) {
      postData =
      {
        firstName: this.profileForm.controls.firstName.value ? this.profileForm.controls.firstName.value : this.accountSettingCSObject.firstName,
        lastName: this.profileForm.controls.lastName.value ? this.profileForm.controls.lastName.value : this.accountSettingCSObject.lastName,
        storeName: this.profileForm.controls.storeName.value,
        telephone: this.profileForm.controls.mobileNo.value ? this.profileForm.controls.mobileNo.value : this.accountSettingCSObject.mobileNo,
        telephoneDialCode: this.dialCode ? this.dialCode : this.dialCode,
        telephoneCountryCode: this.countryCode ? this.countryCode : this.countryCode,
        storeEmail: this.profileForm.controls.email.value ? this.profileForm.controls.email.value : this.accountSettingCSObject.email,
        storeAddress: this.profileForm.controls.address.value ? this.profileForm.controls.address.value : this.accountSettingCSObject.address,
        email: null,
        address: null,
        pictureType: 'AVATAR',
        picture: this.selectedIcon,
        enableStylist: this.profileForm.controls.enableStylist.value ? this.profileForm.controls.enableStylist.value : 'false',
        location: this.dataReturned.location ? this.dataReturned.location : this.accountSettingCSObject.location,
        googleAddress: this.dataReturned.address ? this.dataReturned.address : this.accountSettingCSObject.googleAddress,
        latitude: this.dataReturned.latitude ? this.dataReturned.latitude : this.accountSettingCSObject.latitude,
        longitude: this.dataReturned.longitude ? this.dataReturned.longitude : this.accountSettingCSObject.longitude,
        adminAreaLevel1: this.dataReturned.adminAreaLevel1 ? this.dataReturned.adminAreaLevel1 : this.accountSettingCSObject.adminAreaLevel1,
        adminAreaLevel2: this.dataReturned.adminAreaLevel2 ? this.dataReturned.adminAreaLevel2 : this.accountSettingCSObject.adminAreaLevel2,
        locality: this.dataReturned.locality ? this.dataReturned.locality : this.accountSettingCSObject.locality,
        subLocality: this.dataReturned.subLocality ? this.dataReturned.subLocality : this.accountSettingCSObject.subLocality,
        postalCode: this.dataReturned.postalCode ? this.dataReturned.postalCode : this.accountSettingCSObject.postalCode
      };

      this.userData.storeName = postData.storeName;
      this.userData.storeEmail = postData.storeEmail;
      this.userData.storeAddress = postData.firstName;
      this.userData.telephone = postData.telephone;
      this.userData.telephoneDialCode = postData.firstName;
    }

    else {
      postData =
      {
        firstName: this.profileForm.controls.firstName.value ? this.profileForm.controls.firstName.value : this.accountSettingCSObject.firstName,
        lastName: this.profileForm.controls.lastName.value ? this.profileForm.controls.lastName.value : this.accountSettingCSObject.lastName,
        email: this.profileForm.controls.email.value,
        address: this.profileForm.controls.address.value,
        pictureType: 'AVATAR',
        picture: this.selectedIcon,
        location: this.dataReturned.location ? this.dataReturned.location : this.accountSettingCSObject.location,
        googleAddress: this.dataReturned.address ? this.dataReturned.address : this.accountSettingCSObject.googleAddress,
        latitude: this.dataReturned.latitude ? this.dataReturned.latitude : this.accountSettingCSObject.latitude,
        longitude: this.dataReturned.longitude ? this.dataReturned.longitude : this.accountSettingCSObject.longitude,
        adminAreaLevel1: this.dataReturned.adminAreaLevel1 ? this.dataReturned.adminAreaLevel1 : this.accountSettingCSObject.adminAreaLevel1,
        adminAreaLevel2: this.dataReturned.adminAreaLevel2 ? this.dataReturned.adminAreaLevel2 : this.accountSettingCSObject.adminAreaLevel2,
        locality: this.dataReturned.locality ? this.dataReturned.locality : this.accountSettingCSObject.locality,
        subLocality: this.dataReturned.subLocality ? this.dataReturned.subLocality : this.accountSettingCSObject.subLocality,
        postalCode: this.dataReturned.postalCode ? this.dataReturned.postalCode : this.accountSettingCSObject.postalCode

      };
      this.userData.address = postData.address;
      this.userData.email = postData.email;
    }
    this.userData.firstName = postData.firstName;
    this.userData.lastName = postData.lastName;
    this.userData.pictureType = postData.pictureType;
    this.userData.pictureUrl = postData.picture;

    if (postData) {
      console.log(postData, "postData");

      this.accountSettingService
        .profileUpdate(postData)
        .subscribe(
          async (data) => {
            if (data && data.status === 'SUCCESS') {
              await this.storage.set('userData', this.userData);
              this.sharedService.changeProfileCheck(1);
              this.nav.GoBackTo('/home/tabs/tab4');
              this.toast.showToast('Updated successfully');
            } else {
              this.toast.showToast('Problem updating profile');
            }
          },
          async (err) => {
            this.toast.showToast('Problem updating profile');
          }
        );
    }
  }

  // Open Modal
  async openModal() {
    const modal = await this.modalController.create({
      component: LocationsearchComponent,
      componentProps: {
        modalId: 0,
        modalTitle: 'Location Search'
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        // alert('Modal Sent Data :'+ dataReturned);
        console.log('returned data:' + this.dataReturned.latitude, this.dataReturned.longitude);
      }
    });

    return await modal.present();
  }

  previous() {
    this.nav.GoBackTo('/home/tabs/tab4');
  }
  gotoUrl(url: string) {
    this.nav.GoForward(url);
  }

  goBack(url: string) {
    this.nav.GoBackTo(url);
  }
}
