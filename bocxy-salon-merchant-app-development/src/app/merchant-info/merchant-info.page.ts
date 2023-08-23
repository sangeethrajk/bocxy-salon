import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuController, NavController, LoadingController } from '@ionic/angular';
import { Validators, FormControl, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { MerchantInfoService } from './merchant-info.service';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { LocationsearchPage } from '../../app/locationsearch/locationsearch.page';
import { AutocompleteLibComponent } from 'angular-ng-autocomplete';
import { StoreTypesList } from '../_models/account.model';
import { AccountService } from '../_services/account.service';
import { GeoAddress } from '../_models/geo-address.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-merchant-info',
  templateUrl: './merchant-info.page.html',
  styleUrls: ['./merchant-info.page.scss'],
  providers: [Keyboard]
})
export class MerchantInfoPage implements OnInit {
  shopLocation = false;
  public registerProfile: FormGroup;
  isKeyboardHide = true;
  errCount: number;
  fieldName: string;
  type: string;
  dataReturned: GeoAddress = new GeoAddress();
  storeTypesList: StoreTypesList[];
  acceptTc: any;

  constructor(
    public keyboard: Keyboard,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    private merchantInfoService: MerchantInfoService,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    public modalController: ModalController,
    private accountService: AccountService,
    public translate: TranslateService,
    public translateModule: TranslateModule
  ) { }
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

  ngOnInit() {
    this.getStoreTypesList();
    this.registerProfile = this.formBuilder.group({
      firstName: [null, Validators.compose([
        Validators.required,
        Validators.pattern(/^([\w\-][a-zA-Z0-9_ ]{0,30})$/)
      ])],
      storeName: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([
        Validators.required,
        Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
      ])],
      address: [null, Validators.compose([
        Validators.required,
        Validators.pattern(/^(\w*\s*[\#\-\,\/\.\(\)\&]*)+/)
      ])],
      ShopLocation: [null, Validators.compose([Validators.required])],
      storeTypeId: [
        null, Validators.compose([Validators.required])
      ]
    });
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

  onChangeFields() {

    let type = '';
    let errCount = 0;
    let fieldName = '';

    if (this.registerProfile.get('firstName').hasError('required') || this.registerProfile.get('firstName').hasError('pattern')) {
      if (this.registerProfile.get('firstName').hasError('required')) {
        type = 'Mandatory';
      } else {
        type = 'Invalid';
      }
      errCount = errCount + 1;
      fieldName = 'Full Name';
    }
    if (this.registerProfile.get('storeName').hasError('required')) {
      errCount = errCount + 1;
      fieldName = 'Salon / SPA Name';
      type = 'Mandatory';
    }
    if (this.registerProfile.get('storeTypeId').hasError('required')) {
      errCount = errCount + 1;
      fieldName = 'Store Type';
      type = 'Mandatory';
    }
    if (this.registerProfile.get('email').hasError('required') || this.registerProfile.get('email').hasError('pattern')) {
      if (this.registerProfile.get('email').hasError('required')) {
        type = 'Mandatory';
      } else {
        type = 'Invalid';
      }
      errCount = errCount + 1;
      fieldName = 'Email';
    }

    if (this.registerProfile.get('address').hasError('required') || this.registerProfile.get('address').hasError('pattern')) {
      if (this.registerProfile.get('address').hasError('required')) {
        type = 'Mandatory';
      } else {
        type = 'Invalid';
      }
      errCount = errCount + 1;
      fieldName = 'Address';
    }
    console.log(this.type, '=-==-');
    this.errCount = errCount;
    this.fieldName = fieldName;
    this.type = type;
  }
  onLocationFocus() {
    this.navCtrl.navigateRoot('/shoplocation');
  }



  saveProfile() {

    let type = '';
    let errCount = 0;
    let fieldName = '';

    if (this.registerProfile.get('firstName').hasError('required') || this.registerProfile.get('firstName').hasError('pattern')) {
      if (this.registerProfile.get('firstName').hasError('required')) {
        type = 'Mandatory';
      } else {
        type = 'Invalid';
      }
      errCount = errCount + 1;
      fieldName = 'Full Name';
    }
    if (this.registerProfile.get('storeName').hasError('required')) {
      errCount = errCount + 1;
      fieldName = 'Salon / SPA Name';
      type = 'Mandatory';
    }
    if (this.registerProfile.get('storeTypeId').hasError('required')) {
      errCount = errCount + 1;
      fieldName = 'Store Type';
      type = 'Mandatory';
    }
    if (this.registerProfile.get('email').hasError('required') || this.registerProfile.get('email').hasError('pattern')) {
      if (this.registerProfile.get('email').hasError('required')) {
        type = 'Mandatory';
      } else {
        type = 'Invalid';
      }
      errCount = errCount + 1;
      fieldName = 'Email';
    }
    if (this.registerProfile.get('address').hasError('required') || this.registerProfile.get('address').hasError('pattern')) {
      if (this.registerProfile.get('address').hasError('required')) {
        type = 'Mandatory';
      } else {
        type = 'Invalid';
      }
      errCount = errCount + 1;
      fieldName = 'Address';
    }

    this.errCount = errCount;
    this.fieldName = fieldName;
    this.type = type;

    if (this.errCount === 0) {
      const loading = this.loadingCtrl.create();
      loading.then(l => l.present());
      this.storage.get('dialCode').then((dialCode) => {
        this.storage.get('mobileNumber').then((mobileNumber) => {
          const postData = {
            mobileNo: mobileNumber,
            dialCode,
            firstName: this.registerProfile.value.firstName,
            storeName: this.registerProfile.value.storeName,
            storeEmail: this.registerProfile.value.email,
            storeAddress: this.registerProfile.value.address,
            email: null,
            address: null,
            location: this.dataReturned.location,
            googleAddress: this.dataReturned.address,
            latitude: this.dataReturned.latitude,
            longitude: this.dataReturned.longitude,
            type: "MERCHANT",
            storeTypeId: this.registerProfile.value.storeTypeId,
            country: this.dataReturned.country,
            adminAreaLevel1: this.dataReturned.adminAreaLevel1,
            adminAreaLevel2: this.dataReturned.adminAreaLevel2,
            locality: this.dataReturned.locality,
            subLocality: this.dataReturned.subLocality,
            postalCode: this.dataReturned.postalCode
          };
          /* location: this.dataReturned.location,
          googleAddress: this.dataReturned.address,
          latitude: this.dataReturned.latitude,
          longitude: this.dataReturned.longitude */
          console.log(postData, '=-=postdata===');
          this.merchantInfoService.registerProfile(postData)
            .subscribe(
              data => {
                loading.then(l => l.dismiss());
                console.log(data, 'response data');
                if (data.data && data.status === 'SUCCESS') {

                  this.navCtrl.navigateRoot('/security-question');
                }
              }, err => {
                loading.then(l => l.dismiss());
              }
            );

        });
      });

    }

  }

  getStoreTypesList() {
    this.accountService.getStoreTypesList().subscribe(data => {
      if (data.status === 'SUCCESS') {
        this.storeTypesList = data.data;
      }
    });
  }

}
