import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { StylistGrade } from '../_models/stylistgrade.model';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { GradeService } from './creategrade.service';
import { ToastService } from '../_services/toast.service';
import { SharedService } from '../_services/shared.service';
import { constants } from 'buffer';

@Component({
  selector: 'app-creategrade',
  templateUrl: './creategrade.page.html',
  styleUrls: ['./creategrade.page.scss'],
})
export class CreategradePage implements OnInit {
  showDisable = false;
  editData: StylistGrade;
  gradeForm: FormGroup;
  existGrade: string;
  formSubmitted: boolean;
  disableCreateButton: boolean;

  constructor(
    public modalCtrl: ModalController,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private gradeService: GradeService,
    private toast: ToastService,
    private sharedService: SharedService,
    private loadingCtrl: LoadingController) { }

  async ngOnInit() {
    this.formSubmitted = false;
    this.disableCreateButton = false;
    this.gradeForm = this.createForm();
    this.showDisable = this.editData ? (this.editData.active === 'N' ? true : false) : false;
    console.log(this.showDisable);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  createForm(): FormGroup {
    return this.formBuilder.group(
      {
        name: [this.editData ? this.editData.name : null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z_ ]*$/i),])],
        disable: [
          this.editData ? (this.editData.active === 'N' ? true : false) : false,
        ],
        showDisable: [
          null
        ],
      },
    );
  }

  async gradeSubmit() {
    this.disableCreateButton = true;
    this.formSubmitted = true;
    if (this.gradeForm.valid) {
      const grade = this.gradeForm.value.name.trim();
      let active = 'Y';
      if (this.gradeForm.value.disable) {
        active = 'N';
      }
      const response = await this.checkGrade(grade);

      if (response && response.status === 'SUCCESS') {
        if (response.data.length === 0) {
          const loading = this.loadingCtrl.create();
          loading.then(l => l.present());
          if (this.editData) {
            this.editData.name = grade;
            this.editData.active = 'Y';
            if (this.gradeForm.value.disable) {
              this.editData.active = 'N';
            }
            this.gradeService.updateGrade(this.editData).subscribe(
              (updateResponse) => {
                loading.then(l => l.dismiss());
                if (updateResponse && updateResponse.status === 'SUCCESS') {
                  if (updateResponse.data) {
                    this.sharedService.changeGradeManagmentRefresh(1);
                    this.toast.showToast('Successfully updated grade');
                    this.dismiss();
                  }
                  else {
                    this.disableCreateButton = false;
                    this.toast.showToast('Something went wrong. Please try again');
                  }
                }
                else {
                  this.disableCreateButton = false;
                  this.toast.showToast('Something went wrong. Please try again');
                }
              }
            );
          } else {
            this.gradeService.addGrade(grade, active).subscribe(
              (addResponse) => {
                loading.then(l => l.dismiss());
                if (addResponse && addResponse.status === 'SUCCESS') {
                  this.sharedService.changeGradeManagmentRefresh(1);
                  this.toast.showToast('Successfully added grade');
                  this.dismiss();
                }
                else {
                  this.disableCreateButton = false;
                  this.toast.showToast('Something went wrong. Please try again');
                }
              }
            );
          }
        }
        else {
          this.existGrade = response.data[0].name;
          this.disableCreateButton = false;
        }
      }
      else {
        this.toast.showToast('Something went wrong. Please try again');
        this.disableCreateButton = false;
      }
    }
    else {
      this.disableCreateButton = false;
    }

  }
  disableToggle() {
    if (this.showDisable) {
      this.gradeForm.get('showDisable').enable();
    } else {
      this.gradeForm.get('showDisable').disable();
    }
  }

  checkGrade(grade: string): Promise<any> {
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    return new Promise((resolve, reject) => {
      if (this.editData) {
        if (this.editData.name === grade) {
          resolve({ status: "SUCCESS", data: [] });
          loading.then(l => l.dismiss());
        } else {
          this.gradeService.checkGrade(grade).pipe().subscribe(
            (response) => {
              loading.then(l => l.dismiss());
              resolve(response);
            },
            (error) => {
              this.toast.showToast('Something went wrong. Please try again');
              reject(error);
            }
          );
        }
      } else {
        this.gradeService.checkGrade(grade).pipe().subscribe(
          (response) => {
            loading.then(l => l.dismiss());
            resolve(response);
          },
          (error) => {
            this.toast.showToast('Something went wrong. Please try again');
            reject(error);
          }
        );
      }
    });
  }

}
