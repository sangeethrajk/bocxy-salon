import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { StylistProfieCompleteService } from './stylist-profile-complete.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { StylistDetails } from '../addstylist/addstylist.model';
import { ToastService } from '../_services/toast.service';
import { Storage } from '@ionic/storage';
import { HardBackService } from '../_services/hardback.service';

@Component({
  selector: 'app-stylist-profile-complete',
  templateUrl: './stylist-profile-complete.page.html',
  styleUrls: ['./stylist-profile-complete.page.scss'],
  providers: [Keyboard]
})
export class StylistProfieCompletePage implements OnInit {

  mobileNo: number;
  dialCode: string;
  roleCode: string;
  public registerProfile: FormGroup;
  passwordToggle = false;
  isKeyboardHide = true;
  errCount: number;
  fieldName: string;
  type: string;
  telephoneDialCode: string;
  editData: StylistDetails;

  isTextFieldType: boolean;
  public passwordForm: FormGroup;
  compareConfirmPassword = false;
  patternPassword = false;
  mandatory = true;
  valueChanged = false;
  formSubmitted = false;

  constructor(
    public keyboard: Keyboard,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    private stylistProfieCompleteService: StylistProfieCompleteService,
    private formBuilder: FormBuilder,
    private loadingctrl: LoadingController,
    public route: ActivatedRoute,
    private toast: ToastService,
    private alertController: AlertController,
    private hardBackService: HardBackService,
    private storage: Storage
  ) { }
  async ngOnInit() {
    try {
      const loading = await this.loadingctrl.create({
        spinner: 'bubbles',
        message: 'Please wait...',
        cssClass: 'custom-spinner',
      });
      loading.present();
      this.mobileNo = await this.storage.get('mobileNumber');
      this.dialCode = await this.storage.get('dialCode');
      this.roleCode = await this.storage.get('roleCodes');
      if (this.mobileNo && this.dialCode && (this.roleCode.includes('MG') || this.roleCode.includes('ST'))) {
        await this.getEditData();
        this.initiateForm();
        loading.dismiss();
      } else {
        this.toast.showToast('Something went wrong');
        loading.dismiss();
      }
    } catch (err) {
      console.log('something went wrong: ', err);
    }
    // BackToExit
    // this.hardBackService.backToExit();
  }
  initiateForm() {
    this.registerProfile = this.formBuilder.group({
      firstName: [this.editData ? this.editData.firstName : null, Validators.compose([
        Validators.required,
        Validators.pattern(/^([\w\-][a-zA-Z0-9_ ]{0,30})$/)
      ])],
      email: [this.editData ? this.editData.email : null, Validators.compose([
        // Validators.required,
        Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
      ])],
      address: [this.editData ? this.editData.address : null, Validators.compose([
        // Validators.required,
        Validators.pattern(/^(\w*\s*[\#\-\,\/\.\(\)\&]*)+/)
      ])]
    });

    this.passwordForm = this.formBuilder.group({
      password: [null, Validators.compose([Validators.required, Validators.pattern(/(?=.*?)(?=.*?[a-z])(?=.*?[0-9])(?=.*?).{6,}/)])],
      confirmPassword: [null, Validators.compose([Validators.required])]
    });
  }
  getEditData() {
    return new Promise((resolve, reject) => {
      this.stylistProfieCompleteService
        .getEditData(this.mobileNo, this.dialCode)
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
      const loading = this.loadingctrl.create();
      loading.then(l => l.present());
      if (this.mobileNo && this.dialCode && (this.roleCode.includes('MG') || this.roleCode.includes('ST'))) {
        const postData = {
          mobileNo: this.mobileNo,
          dialCode: this.dialCode,
          firstName: this.registerProfile.value.firstName,
          email: this.registerProfile.value.email,
          address: this.registerProfile.value.address
        };
        console.log(postData, '=-=postdata===');
        this.stylistProfieCompleteService.registerProfile(postData)
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

      }
    }

  }
  comparePassword() {
    this.valueChanged = true;
    setTimeout(() => {
      if (this.passwordForm.controls.password.value) {
        if (this.passwordForm.controls.password.hasError('pattern')) {
          this.patternPassword = true;
          this.compareConfirmPassword = false;
          this.mandatory = false;
        } else {
          if (this.passwordForm.controls.confirmPassword.value) {

            if (!(this.passwordForm.controls.password.value === this.passwordForm.controls.confirmPassword.value)) {
              this.patternPassword = false;
              this.compareConfirmPassword = true;
              this.mandatory = false;
            } else {
              this.patternPassword = false;
              this.compareConfirmPassword = false;
              this.mandatory = false;
            }
          } else {
            this.patternPassword = false;
            this.compareConfirmPassword = false;
            this.mandatory = true;
          }
        }
      } else {
        this.patternPassword = false;
        this.compareConfirmPassword = false;
        this.mandatory = true;
      }
    }, 0);
  }
  savePassword() {
    this.formSubmitted = true;
    console.log(this.passwordForm.get('password').hasError('required'), '=-=-=');
    if (this.patternPassword || this.compareConfirmPassword || this.mandatory) {
      return;
    }

  }
  togglePasswordFieldType() {
    this.isTextFieldType = !this.isTextFieldType;
  }
  showSuccessMessage() {
    this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Congrats!',
      message: 'Stylist account created successfully! please login.',
      buttons: ['OK']
    }).then(alert => alert.present());
  }
}
