import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { AccountSettingsService } from './accountsettings.service';
import { AccountSettingsManager, AccountSettingsMerchant } from './accountSettings.model';
import { Ng2TelInput } from 'ng2-tel-input';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ToastService } from '../_services/toast.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { SharedService } from '../_services/shared.service';
import { LocationsearchPage } from '../locationsearch/locationsearch.page';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { AccountService } from '../_services/account.service';
import { StoreTypesList } from '../_models/account.model';
import { GeoAddress } from '../_models/geo-address.model';

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
  accountSettingMRObject: AccountSettingsMerchant;
  accountSettingMGObject: AccountSettingsManager;
  telInputOptions = { initialCountry: 'in', onlyCountries: ['in'] };
  profileForm: FormGroup;
  mobileNumber: number;
  dialCode: string;
  exist: number;
  countryCode: any = 'in';
  formSubmitted: boolean;
  dataReturned: GeoAddress = new GeoAddress();
  storeTypesList: StoreTypesList[];

  constructor(
    private accountSettingService: AccountSettingsService,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private toast: ToastService,
    private loadingctrl: LoadingController,
    private sharedService: SharedService,
    public modalController: ModalController,
    private nav: NavigationHandler,
    private accountService: AccountService
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
      this.getStoreTypesList();
      if (this.userData && this.userData.roleCodes.includes('MR')) {
        await this.accountSettingService.getCurrentUserAccountForMerchant().subscribe(data => {
          if (data.status === 'SUCCESS') {
            this.accountSettingMRObject = data.data;
            this.selectedIcon = this.accountSettingMRObject && this.accountSettingMRObject.pictureUrl ? this.accountSettingMRObject.pictureUrl : 'assets/icon/male_icon.svg';
            this.profileForm = this.createForm();
            loading.dismiss();
          }

        });
      }
      else if (this.userData && (this.userData.roleCodes.includes('MG') || this.userData.roleCodes.includes('ST'))) {
        await this.accountSettingService.getCurrentUserAccountForManager().subscribe(data => {
          if (data.status == 'SUCCESS') {
            this.accountSettingMGObject = data.data;
            this.selectedIcon = this.accountSettingMGObject && this.accountSettingMGObject.pictureUrl ? this.accountSettingMGObject.pictureUrl : 'assets/icon/male_icon.svg';
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
    let firstName, lastName, email, mobileNo, storeName, address, enableStylist, storeType;
    if (this.userData && this.userData.roleCodes && this.userData.roleCodes.includes('MR')) {
      firstName = this.accountSettingMRObject ? this.accountSettingMRObject.firstName : null;
      lastName = this.accountSettingMRObject ? this.accountSettingMRObject.lastName : null;
      email = this.accountSettingMRObject ? this.accountSettingMRObject.storeEmail : null;
      mobileNo = this.accountSettingMRObject ? this.accountSettingMRObject.telephone : null;
      storeName = this.accountSettingMRObject ? this.accountSettingMRObject.storeName : null;
      address = this.accountSettingMRObject ? this.accountSettingMRObject.storeAddress : null;
      enableStylist = this.accountSettingMRObject ? this.accountSettingMRObject.enableStylist : null;
      storeType = this.accountSettingMRObject ? this.accountSettingMRObject.storeType : null;
    }
    else if ((this.userData && this.userData.roleCodes.includes('MG')) || (this.userData && this.userData.roleCodes.includes('ST'))) {
      firstName = this.accountSettingMGObject ? this.accountSettingMGObject.firstName : null;
      lastName = this.accountSettingMGObject ? this.accountSettingMGObject.lastName : null;
      email = this.accountSettingMGObject ? this.accountSettingMGObject.email : null;
      address = this.accountSettingMGObject ? this.accountSettingMGObject.address : null;


    }
    this.dataReturned.address = address;
    console.log(address);

    return this.formBuilder.group({
      firstName: [firstName, Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-z]+( [a-z]+)*$/i),
      ])],
      storeName: [storeName, this.userData.roleCodes.includes('MR') ? Validators.compose([Validators.required]) : null],
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
      ],
      enableStylist: [
        enableStylist, Validators.compose([
        ])
      ],
      storeType: [
        storeType,
        this.userData.roleCodes.includes('MR') ? Validators.compose([Validators.required]) : null
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
        if (this.accountSettingMRObject) {
          if (
            value.mobileNo === this.accountSettingMRObject.mobileNo && value.dialCode === this.accountSettingMRObject.dialCode
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
    console.log(this.profileForm);
    let postData;
    this.formSubmitted = true;
    if (!this.profileForm.valid) {
      return;
    }
    console.log('form data:' + this.profileForm.value);
    if (this.userData && this.userData.roleCodes.includes('MR')) {
      postData =
      {
        firstName: this.profileForm.controls.firstName.value ? this.profileForm.controls.firstName.value : this.accountSettingMRObject.firstName,
        lastName: this.profileForm.controls.lastName.value ? this.profileForm.controls.lastName.value : this.accountSettingMRObject.lastName,
        storeName: this.profileForm.controls.storeName.value ? this.profileForm.controls.storeName.value : this.accountSettingMRObject.storeName,
        telephone: this.profileForm.controls.mobileNo.value ? this.profileForm.controls.mobileNo.value : this.accountSettingMRObject.mobileNo,
        telephoneDialCode: this.dialCode,
        telephoneCountryCode: this.countryCode ? this.countryCode : this.accountSettingMRObject.country,
        storeEmail: this.profileForm.controls.email.value ? this.profileForm.controls.email.value : this.accountSettingMRObject.storeEmail,
        storeAddress: this.profileForm.controls.address.value ? this.profileForm.controls.address.value : this.accountSettingMRObject.storeAddress,
        email: null,
        address: null,
        pictureType: 'AVATAR',
        picture: this.selectedIcon,
        enableStylist: this.profileForm.controls.enableStylist.value ? this.profileForm.controls.enableStylist.value : 'false',
        location: this.dataReturned.location ? this.dataReturned.location : this.accountSettingMRObject.location,
        googleAddress: this.dataReturned.address ? this.dataReturned.address : this.accountSettingMRObject.googleAddress,
        latitude: this.dataReturned.latitude ? this.dataReturned.latitude : this.accountSettingMRObject.latitude,
        longitude: this.dataReturned.longitude ? this.dataReturned.longitude : this.accountSettingMRObject.longitude,
        country: this.dataReturned.country ? this.dataReturned.country : this.accountSettingMRObject.country,
        adminAreaLevel1: this.dataReturned.adminAreaLevel1 ? this.dataReturned.adminAreaLevel1 : this.accountSettingMRObject.adminAreaLevel1,
        adminAreaLevel2: this.dataReturned.adminAreaLevel2 ? this.dataReturned.adminAreaLevel2 : this.accountSettingMRObject.adminAreaLevel2,
        locality: this.dataReturned.locality ? this.dataReturned.locality : this.accountSettingMRObject.locality,
        subLocality: this.dataReturned.subLocality ? this.dataReturned.subLocality : this.accountSettingMRObject.subLocality,
        postalCode: this.dataReturned.postalCode ? this.dataReturned.postalCode : this.accountSettingMRObject.postalCode
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
        firstName: this.profileForm.controls.firstName.value ? this.profileForm.controls.firstName.value : this.accountSettingMGObject.firstName,
        lastName: this.profileForm.controls.lastName.value ? this.profileForm.controls.lastName.value : this.accountSettingMGObject.lastName,
        email: this.profileForm.controls.email.value ? this.profileForm.controls.email.value : this.accountSettingMGObject.email,
        address: this.profileForm.controls.address.value ? this.profileForm.controls.address.value : this.accountSettingMGObject.address,
        pictureType: 'AVATAR',
        picture: this.selectedIcon ? this.selectedIcon : this.accountSettingMGObject.firstName,
        location: this.dataReturned.location ? this.dataReturned.location : this.accountSettingMGObject.location,
        googleAddress: this.dataReturned.address ? this.dataReturned.address : this.accountSettingMGObject.googleAddress,
        latitude: this.dataReturned.latitude ? this.dataReturned.latitude : this.accountSettingMGObject.latitude,
        longitude: this.dataReturned.longitude ? this.dataReturned.longitude : this.accountSettingMGObject.longitude,
        country: this.dataReturned.country ? this.dataReturned.country : this.accountSettingMGObject.country,
        adminAreaLevel1: this.dataReturned.adminAreaLevel1 ? this.dataReturned.adminAreaLevel1 : this.accountSettingMGObject.adminAreaLevel1,
        adminAreaLevel2: this.dataReturned.adminAreaLevel2 ? this.dataReturned.adminAreaLevel2 : this.accountSettingMGObject.adminAreaLevel2,
        locality: this.dataReturned.locality ? this.dataReturned.locality : this.accountSettingMGObject.locality,
        subLocality: this.dataReturned.subLocality ? this.dataReturned.subLocality : this.accountSettingMGObject.subLocality,
        postalCode: this.dataReturned.postalCode ? this.dataReturned.postalCode : this.accountSettingMGObject.postalCode
      };
      this.userData.address = postData.address;
      this.userData.email = postData.email;
    }
    this.userData.firstName = postData.firstName;
    this.userData.lastName = postData.lastName;
    this.userData.pictureType = postData.pictureType;
    this.userData.pictureUrl = postData.picture;
    console.log(postData);

    if (postData) {
      this.accountSettingService
        .profileUpdate(postData)
        .subscribe(
          async (data) => {
            if (data && data.status === 'SUCCESS') {
              await this.storage.set('userData', this.userData);
              this.sharedService.changeProfileCheck(1);
              this.nav.GoBackTo('/myaccount');
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

  gotoUrl(url: string) {
    this.nav.GoForward(url);
  }

  goBack(url: string) {
    this.nav.GoBackTo(url);
  }

  // Open Modal
  async openModal() {
    const modal = await this.modalController.create({
      component: LocationsearchPage,
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

  getStoreTypesList() {
    this.accountService.getStoreTypesList().subscribe(data => {
      if (data.status === 'SUCCESS') {
        this.storeTypesList = data.data;
      }
    });
  }
}
