import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { MenuController, NavController, LoadingController } from '@ionic/angular';
import { Validators, FormControl, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { CustomerInfoService } from './customer-info.service';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { LocationsearchComponent } from '../locationsearch/locationsearch.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.page.html',
  styleUrls: ['./customer-info.page.scss'],
  providers: [Keyboard]
})
export class CustomerInfoPage implements OnInit {

  @ViewChild('ngTelInput')
  ngTelInput: ElementRef;
  isKeyboardHide = true;
  shopLocation = false;
  registerProfile: FormGroup;
  telInputOptions = { initialCountry: 'in' };
  countryCode = 'in';
  errCount: number;
  fieldName: string;
  type: string;
  telephoneDialCode: string;

  dataReturned: any = { location: '', address: '' };
  acceptTc: any;

  constructor(
    public keyboard: Keyboard,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    private customerInfoService: CustomerInfoService,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    public modalController: ModalController,
    public translate: TranslateService,
    public TranslateModule: TranslateModule
  ) { }

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
    this.registerProfile = this.formBuilder.group({
      firstName: [null, Validators.compose([
        Validators.required,
        Validators.pattern(/^([\w\-][a-zA-Z0-9_ ]{0,30})$/)
      ])],
      lastName: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([
        Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
      ])],
      address: [null, Validators.compose([
        Validators.required,
        Validators.pattern(/^(\w*\s*[\#\-\,\/\.\(\)\&]*)+/)
      ])],
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
    if (this.registerProfile.get('lastName').hasError('required')) {
      errCount = errCount + 1;
      fieldName = 'Salon / SPA Name';
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
    if (this.registerProfile.get('lastName').hasError('required')) {
      errCount = errCount + 1;
      fieldName = 'Salon / SPA Name';
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
            lastName: this.registerProfile.value.lastName,
            telephone: null,
            telephoneDialCode: null,
            telephoneCountryCode: null,
            email: this.registerProfile.value.email,
            address: this.registerProfile.value.address,
            location: this.dataReturned.location,
            googleAddress: this.dataReturned.address,
            latitude: this.dataReturned.latitude,
            longitude: this.dataReturned.longitude,
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
          this.customerInfoService.registerProfile(postData)
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

}
