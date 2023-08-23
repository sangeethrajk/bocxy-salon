import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { MenuController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { Validators, FormControl, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { PasswordService } from './create-passoword.service';
import { Storage } from '@ionic/storage';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-createpw',
  templateUrl: './createpw.page.html',
  styleUrls: ['./createpw.page.scss'],
  providers: [Keyboard]
})
export class CreatepwPage implements OnInit {

  isKeyboardHide = true;
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
    private passwordService: PasswordService,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    public translate: TranslateService,
    public TranslateModule: TranslateModule
  ) { }

  ngOnInit() {

    this.passwordForm = this.formBuilder.group({
      password: [null, Validators.compose([Validators.required, Validators.pattern(/(?=.*?)(?=.*?[a-z])(?=.*?[0-9])(?=.*?).{6,}/)])],
      confirmPassword: [null, Validators.compose([Validators.required])]
    });

  }

  comparePassword() {
    this.valueChanged = true;
    setTimeout(() => {
      console.log('password--', this.passwordForm.controls.password.value, this.passwordForm.controls.confirmPassword.value);
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
    if (this.patternPassword || this.compareConfirmPassword || this.mandatory) {
      return;
    }

    const loading = this.loadingCtrl.create();
    loading.then(loading => loading.present());
    this.storage.get('dialCode').then((dialCode) => {
      this.storage.get('mobileNumber').then((mobileNumber) => {
        this.storage.get('roleCodes').then((roleCode) => {
          const postData = {
            mobileNo: mobileNumber,
            dialCode,
            countryCode: 'IN',
            isSubmit: true,
            password: this.passwordForm.value.password
          };
          console.log(postData, '=-=postdata===');
          this.passwordService.register(postData)
            .subscribe(
              data => {
                loading.then(loading => loading.dismiss());
                console.log(data, 'response data');
                if (data.data && data.status === 'SUCCESS') {

                  this.navCtrl.navigateRoot('/login');
                  this.showSuccessMessage(roleCode);
                  this.clearStorage();
                }
              }, err => {
                loading.then(loading => loading.dismiss());
              }
            );

        });
      });
    });


  }
  togglePasswordFieldType() {
    this.isTextFieldType = !this.isTextFieldType;
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
  showSuccessMessage(roleCode: string[]) {
    this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Congrats!',
      message: roleCode ? (roleCode.includes('ST') ? 'Stylist account created successfully! please login.' : roleCode.includes('MG') ? 'Manager account created successfully! please login.' : '') : 'Merchant account created successfully! please login.',
      buttons: ['OK']
    }).then(alert => {
      alert.present()
    }).catch(err => {
      console.log(err);

    });
  }
  clearStorage() {
    this.storage.clear();
  }

}
