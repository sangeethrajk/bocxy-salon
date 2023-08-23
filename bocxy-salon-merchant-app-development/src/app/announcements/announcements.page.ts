import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PermissionService } from '../_services/permission.service';
import { NavController } from '@ionic/angular';
import { ModalController, AlertController, Platform, LoadingController } from '@ionic/angular';
import { ToastService } from '../_services/toast.service';
import { annoucementsServices } from './annoucements.service';
import { NavigationHandler } from '../_services/navigation-handler.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.page.html',
  styleUrls: ['./announcements.page.scss'],
})
export class AnnouncementsPage implements OnInit {
  annoucementsServiceForm: FormGroup;
  formSubmitted: boolean;
  constructor(
    private _location: Location,
    private permissionService: PermissionService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    public alertCtrl: AlertController,
    private AnnoucementsServices: annoucementsServices,
    private loadingCtrl: LoadingController,
    private toast: ToastService,
    private nav: NavigationHandler
  ) {
    this.permissionService.checkPermissionAccess('ANNOUNCEMENT_MANAGEMENT').then(
      data => {
        if (!data) {
          this.navCtrl.navigateRoot('/login');
        }
      }
    )
  }

  ngOnInit() {
    this.annoucementsServiceForm = this.createForm();
  }
  createForm(): FormGroup {
    return this.formBuilder.group({
      Title: [null,
        Validators.compose([Validators.required]),
      ],
      Customers: [null,
        Validators.compose([Validators.required]),
      ],
      Description: [null,
        Validators.compose([Validators.required]),
      ],
    });
  }
  formSubmit() {
    console.log(this.annoucementsServiceForm.valid);
    this.formSubmitted = true;
    if (!this.annoucementsServiceForm.valid) {
      return;
    } else {
      const formData: any = {
        title: this.annoucementsServiceForm.value.Title.trim(),
        customerType: this.annoucementsServiceForm.value.Customers,
        content: this.annoucementsServiceForm.value.Description.trim()
      };
      console.log(formData);
      this.AnnoucementsServices.createAnnoucements(formData).subscribe(
        (data) => {
          if (data && data.status === 'SUCCESS') {
            this.navCtrl.navigateRoot('/home');
            this.toast.showToast('Announcement published');
          } else {
            this.toast.showToast('Problem publishing announcement');
          }
        },
        async (err) => {
          this.toast.showToast('Problem publishing announcement');
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
}
