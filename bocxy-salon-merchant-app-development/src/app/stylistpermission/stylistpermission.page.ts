import { Component, OnInit } from '@angular/core';
import { StylistPermission } from './stylistpermission.model';
import { StylistPermissionService } from './stylist-permission.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { ToastService } from '../_services/toast.service';
import { take } from 'rxjs/operators';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { NavigationHandler } from '../_services/navigation-handler.service';

@Component({
  selector: 'app-stylistpermission',
  templateUrl: './stylistpermission.page.html',
  styleUrls: ['./stylistpermission.page.scss'],
})
export class StylistpermissionPage implements OnInit {
  permissionList: any[] = [];
  accessList: any;
  paramSubscription: Subscription;
  accountId: number;
  permissionAvailedList: any[] = [];
  permissionForm: FormGroup;

  constructor(private stylistService: StylistPermissionService, private loadingctrl: LoadingController, private route: ActivatedRoute, private toast: ToastService, private formBuilder: FormBuilder, public navCtrl: NavController, private location: Location, private nav: NavigationHandler) { }

  async ngOnInit() {
    this.permissionForm = this.formBuilder.group({
      toggleCheckArray: this.formBuilder.array([], [Validators.required]),
    });

    this.stylistService.getPermissionList().subscribe(async data => {
      if (data && data.status == 'SUCCESS') {
        this.permissionList = data.data;
        for (let i = 0; i < this.permissionList.length; i++) {
          this.permissionList[i].checked = false;
        }
        try {
          const loading = await this.loadingctrl.create({
            spinner: 'bubbles',
            message: 'Please wait...',
            cssClass: 'custom-spinner',
          });
          loading.present();
          this.paramSubscription = this.route.params.subscribe(
            async (params: Params) => {
              if (params.accountId) {
                this.accountId = params.accountId;
                await this.getPermissionListByProfiessionistId();
                loading.dismiss();
              } else {
                loading.dismiss();
              }
            }
          );
        } catch (err) {
          console.log('something went wrong: ', err);
        }
      }
    });
  }

  getPermissionListByProfiessionistId() {
    return new Promise((resolve, reject) => {
      this.stylistService.getPermissionListByProfiessionistId(this.accountId).pipe(take(1))
        .subscribe(data => {
          if (data && data.status === 'SUCCESS') {
            this.permissionAvailedList = data.data;
            if (this.permissionAvailedList.length > 0) {
              this.permissionList.forEach(element => {
                if (this.permissionAvailedList.includes(element.permissionId)) {
                  element.checked = true;
                }
                else {
                  if (!element.checked) {
                    element.checked = false;
                  }
                }
              });
            }
          } else {
            this.toast.showToast('Something went wrong');
          }
          resolve(1);
        },
          (error) => {
            console.log(error);
            this.toast.showToast('Something went wrong');
            reject(error);
          });
    });
  }

  toggleChange(event, index) {
    const toggleArray: FormArray = this.permissionForm.get('toggleCheckArray') as FormArray;
    this.permissionList[index].checked = event.target.checked;
    if (event.target.checked) {
      toggleArray.push(new FormControl(this.permissionList[index].permissionId));
    }
    else {
      let i = 0;
      toggleArray.controls.forEach((item: FormControl) => {
        if (item.value == this.permissionList[index].permissionId) {
          toggleArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  updatePermissions() {
    const postData = {
      permissions: this.permissionForm.value.toggleCheckArray
    };
    this.stylistService.saveProfessionistSlots(postData, this.accountId).subscribe(data => {
      if (data && data.status === 'SUCCESS') {
        this.nav.GoBackTo('/stylistmgmt');
        this.toast.showToast('Saved successfully');
      } else {
        this.toast.showToast('Problem occured');
      }
    }, async (err) => {
      this.toast.showToast('Problem occured');
    });
  }

  previous() {
    this.nav.GoBackTo('/stylistmgmt');
  }
}
