import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { ToastService } from '../_services/toast.service';
import { LoadingController, NavController, AlertController, ActionSheetController } from '@ionic/angular';
import { ActivatedRoute, Params } from '@angular/router';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { StoreDefaultSlotsServices } from './defaultservices.service';
import { MerchantServiceDetails } from '../addservices/addservices.model';
import { SharedService } from '../_services/shared.service';
@Component({
  selector: 'app-defaultservicetime',
  templateUrl: './defaultservicetime.page.html',
  styleUrls: ['./defaultservicetime.page.scss'],
})
export class DefaultservicetimePage implements OnInit {
  timeSec: number;
  hours: number;
  temp: number;
  mins: number;
  secs: number;
  Hours: any;
  minutes: any;
  Dmin: number;
  Dhour: number;
  durationErr: boolean;
  formSubmitted: boolean;
  enableDefault: boolean;
  defaultServiceForm: FormGroup;
  defaultDuration: any;
  defaultMin: any;
  editData: MerchantServiceDetails;
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    private toast: ToastService,
    private loadingctrl: LoadingController,
    public route: ActivatedRoute,
    private navCtrl: NavController,
    private sharedService: SharedService,
    private nav: NavigationHandler,
    private defaultSlotServices: StoreDefaultSlotsServices,
    public actionSheetController: ActionSheetController,
  ) { }

  async ngOnInit() {
    try {
      const loading = await this.loadingctrl.create({
        spinner: 'bubbles',
        message: 'Please wait...',
        cssClass: 'custom-spinner',
      });

      loading.present();
      console.log('sgawait');
      await this.getHours();
      await this.getMinutes();
      console.log(this.editData, "Defaultservicedata");
      if (this.editData) {
        if (this.editData.defaultSlot === 'Y') {

          this.enableDefault = true;
          console.log(this.enableDefault);
        }
        if (this.editData.defaultSlotDuration) {
          let defaultSlotDuration = parseInt(this.editData.defaultSlotDuration);
          var minutes = Math.floor(defaultSlotDuration % 60);
          var hours = Math.floor((defaultSlotDuration - minutes) / 60);
          this.editData.durationmin = minutes.toString();
          this.editData.durationHour = hours.toString();
          this.Dhour = hours ? (hours * 60) : 0;
          this.Dmin = minutes ? minutes : 0;
          console.log(hours + ':' + minutes);

        }
        this.defaultServiceForm = this.createForm();
      }

      loading.dismiss();
    } catch (err) {
      console.log('something went wrong: ', err);
    }
  }

  createForm(): FormGroup {
    return this.formBuilder.group({

      duration: [
        this.editData ? this.editData.duration : null,

      ],
      durationmin: [
        this.editData ? this.editData.durationmin : null,

      ],
      durationHours: [
        this.editData ? this.editData.durationHour : null,
      ],
      defaultSlot: [
        this.editData ? (this.editData.defaultSlot === 'Y' ? true : false) : false,

      ]
    });
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  getHours() {

    this.Hours = [];
    let data;
    for (let i = 0; i <= 12; i++) {
      if (i === 1 || i === 0) {
        data = { name: i + " Hr", value: i }
      } else {
        data = { name: i + "  Hrs", value: i }
      }
      this.Hours.push(data);
    }
    console.log(this.Hours);

  }
  getMinutes() {
    this.minutes = [];
    let datas;
    for (let i = 0; i <= 12; i++) {
      const result = i * 5;
      if (i === 0) {
        datas = { name: result + " Min", value: result }
      } else {
        datas = { name: result + " Mins", value: result }
      }
      this.minutes.push(datas);
    }
  }
  durationmin() {
    this.Dmin = parseInt(this.defaultServiceForm.value.durationmin);
    this.getDurationSeconds();
  }
  durationHours() {
    this.Dhour = parseInt(this.defaultServiceForm.value.durationHours);
    this.Dhour = Math.floor(this.Dhour * 60);
    this.getDurationSeconds();
  }
  getDurationSeconds() {
    if (!this.Dhour && !this.Dmin) {
      this.durationErr = true;
    } else {
      this.durationErr = false;
    }
    if (!this.Dhour) {
      this.Dhour = 0;
    }
    if (!this.Dmin) {
      this.Dmin = 0;
    }

    this.defaultDuration = Math.floor((this.Dhour + this.Dmin));
  }
  formSubmit() {
    this.formSubmitted = true;
    if (this.defaultServiceForm.value.defaultSlot === true) {
      this.getDurationSeconds();
      if (this.defaultDuration === 0 || !this.defaultDuration) {
        this.durationErr = true;
        return false;
      } else {
        this.durationErr = false;
      }
    } else {
      this.durationErr = false;
    }
    const formData: any = {
      defaultSlotDuration: this.defaultDuration,
      defaultSlot: this.defaultServiceForm.value.defaultSlot ? 'Y' : 'N',
    };

    if (this.durationErr === false) {
      this.defaultSlotServices.createStoreDefaultSlots(formData).subscribe(
        (data) => {
          if (data && data.status === 'SUCCESS') {
            this.dismiss();
            this.toast.showToast('Added successfully');
            this.sharedService.changeServiceRefresh('Refresh Services');
          } else {
            this.toast.showToast('Problem creating service');
          }
        },
        async (err) => {
          this.toast.showToast('Problem creating service');
        }
      );
    }
  }
}
