import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { MenuController, NavController, LoadingController } from '@ionic/angular';
import { Validators, FormControl, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { SecurityQuestionService } from './security-question.service';
import { Storage } from '@ionic/storage';
import { Location } from '@angular/common';
import { HardbackService } from '../_services/hardback.service';

@Component({
  selector: 'app-security-question',
  templateUrl: './security-question.page.html',
  styleUrls: ['./security-question.page.scss'],
  providers: [Keyboard]
})
export class SecurityQuestionPage implements OnInit {
  isKeyboardHide = true;
  public securityForm: FormGroup;
  errorVal = false;
  errorQueVal = false;
  questionTwo: string;
  securityQuestionOne: Array<{
    securityQuestionId: number,
    question: string
  }>;
  securityQuestionTwo: Array<{
    securityQuestionId: number,
    question: string
  }>;

  constructor(
    public keyboard: Keyboard,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    private securityQuestionService: SecurityQuestionService,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private _location: Location,
    private hardBackService: HardbackService
  ) { 
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    this.securityQuestionService.getSecurityQuestion()
      .subscribe(
        data => {

          loading.then(l => l.dismiss());
          console.log(data, 'response data');
          if (data.data && data.status === 'SUCCESS') {

            this.securityQuestionOne = data.data;
            this.securityQuestionTwo = data.data;
          }
        }, err =>
        loading.then(l => l.dismiss())
      );

    // BackToExit
    this.hardBackService.backToExit();
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
    this.securityForm = this.formBuilder.group({
      securityQueOne: [null, Validators.compose([Validators.required])],
      securityAnsOne: [null, Validators.compose([Validators.required])],
      securityQueTwo: [null, Validators.compose([Validators.required])],
      securityAnsTwo: [null, Validators.compose([Validators.required])],
    });
  }

  onChangeQuestionOne(val) {
    this.securityQuestionTwo = this.securityQuestionOne;
    this.questionTwo = null;
    this.securityQuestionTwo = this.securityQuestionTwo.filter((item) => item.securityQuestionId != val.target.value);

    console.log(this.securityQuestionTwo, '=-=-=-=queuestion 11');
    this.errorQueVal = false;

  }

  onChangeQuestionTwo(val) {
    this.errorQueVal = false;
  }

  onChangeAnswer(val) {
    this.errorVal = false;
  }

  saveSecurityQueAns() {
    // enable the left menu when leaving the login page
    if (this.securityForm.get('securityQueOne').hasError('required') || this.securityForm.get('securityQueTwo').hasError('required')) {

      this.errorQueVal = true;
      this.errorVal = false;

    } else {
      if (this.securityForm.get('securityAnsOne').hasError('required') || this.securityForm.get('securityAnsTwo').hasError('required')) {

        this.errorVal = true;

      } else {

        this.errorVal = false;

      }
      this.errorQueVal = false;
    }

    if (!this.errorVal && !this.errorQueVal) {
      const loading = this.loadingCtrl.create();
      loading.then(l => l.present());
      this.storage.get('dialCode').then((dialCode) => {
        this.storage.get('mobileNumber').then((mobileNumber) => {
          const postData = {
            mobileNo: mobileNumber,
            dialCode,
            securityQuestions: [{
              securityQuestionId: this.securityForm.value.securityQueOne,
              answer: this.securityForm.value.securityAnsOne
            }, {
              securityQuestionId: this.securityForm.value.securityQueTwo,
              answer: this.securityForm.value.securityAnsTwo
            }
            ]
          };
          console.log(postData, '=-=postdata===');
          this.securityQuestionService.registerProfile(postData)
            .subscribe(
              data => {
                loading.then(l => l.dismiss());
                console.log(data, 'response data');
                if (data.data && data.status === 'SUCCESS') {

                  this.navCtrl.navigateRoot('/createpw');
                }
              }, err => {
                loading.then(l => l.dismiss());
              }
            );

        });
      });
    }

  }

  previous() {
    this._location.back();
  }

}
