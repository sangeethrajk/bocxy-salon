import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { MenuController, NavController } from '@ionic/angular';
import { Validators, FormControl, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { UpdatePasswordService } from './updatepw.service';
import { Storage } from '@ionic/storage';
import { ToastService } from '../_services/toast.service';

@Component({
  selector: 'app-updatepw',
  templateUrl: './updatepw.page.html',
  styleUrls: ['./updatepw.page.scss'],
  providers: [Keyboard]
})
export class UpdatepwComponent implements OnInit {

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
    private passwordService: UpdatePasswordService,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private toast: ToastService
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
    this.storage.get('dialCode').then((dialCode) => {
      this.storage.get('mobileNumber').then((mobileNumber) => {
        const postData = {
          mobileNo: mobileNumber,
          dialCode,
          password: this.passwordForm.value.password
        };
        this.passwordService.updatePassword(postData)
          .subscribe(
            data => {
              console.log(data, 'response data');
              if (data && data.status === 'SUCCESS' && data.data === true) {
                this.navCtrl.navigateRoot('/login');
                this.toast.showToast('Password Changed Successfully');
              }
            },
          );

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

}
