import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { MenuController, NavController, LoadingController } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ForgotPasswordService } from '../forgotpw/forgotpw.service';
import { Storage } from '@ionic/storage';
import { take } from 'rxjs/operators';
import { ToastService } from '../_services/toast.service';
import { AccountSecurityQuestions } from '../forgotpw/forgotpw.model';

@Component({
  selector: 'app-answerquestion',
  templateUrl: './answerquestion.page.html',
  styleUrls: ['./answerquestion.page.scss'],
  providers: [Keyboard]
})
export class AnswerquestionComponent implements OnInit {

  isKeyboardHide = true;
  mobileNumber: number;
  dialCode: string;
  questions: AccountSecurityQuestions[];
  index = 0;
  answer: string;
  incorrectError: boolean;
  constructor(
    private _location: Location,
    public keyboard: Keyboard,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private forgotPasswordService: ForgotPasswordService
  ) { }

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

  async ngOnInit() {
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    this.mobileNumber = await this.storage.get('mobileNumber');
    this.dialCode = await this.storage.get('dialCode');
    this.questions = ((await this.getSecurityQuestions()) as AccountSecurityQuestions[]);
    loading.then(l => l.dismiss());
  }
  getSecurityQuestions() {
    return new Promise((resolve, reject) => {
      this.forgotPasswordService.getAccountSecurityQuestions({
        mobileNumber: this.mobileNumber,
        dialCode: this.dialCode
      }).pipe(take(1)).subscribe(data => {
        if (data && (data.status === 'SUCCESS')) {
          resolve(data.data);
        } else {
          resolve(null);
          this.toast.showToast();
        }
      }, err => {
        resolve(null);
        this.toast.showToast();
      });
      // }, 100);
    });
  }
  changeAnswer(e) {
    this.incorrectError = false;

  }
  validateSecurityQuestion() {
    if (!this.answer) {
      return;
    }
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    this.storage.get('dialCode').then((dialCode) => {
      this.storage.get('mobileNumber').then((mobileNumber) => {
        const postData = {
          mobileNo: mobileNumber,
          dialCode,
          securityQuestion: {
            securityQuestionId: this.questions[this.index].questionId,
            answer: this.answer
          }
        };
        this.forgotPasswordService.validateSecurityQuestion(postData)
          .subscribe(
            data => {
              loading.then(l => l.dismiss());
              if (data && data.status === 'SUCCESS' && data.data === true) {
                if ((this.index + 1) === this.questions.length) {
                  this.navCtrl.navigateRoot('/updatepw');
                } else {
                  this.index++;
                  this.answer = null;
                }
              } else {
                this.incorrectError = true;
              }
            },
            err => {
              loading.then(l => l.dismiss());
              this.incorrectError = true;
              this.toast.showToast();
            }
          );

      });
    });
  }
  goToCreatePw() {
    this.navCtrl.navigateRoot('/createpw');
  }

  previous() {
    this._location.back();
  }

}
