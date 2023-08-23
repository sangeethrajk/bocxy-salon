import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { ToastService } from '../_services/toast.service';
import { ListMerchantServiceService } from './tab2.service';
import { MerchantService, MerchantServiceGroups } from './tab2.model';
import { ImageService } from '../_services/image.service';
import { Storage } from '@ionic/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from '../_services/shared.service';
import { HardBackService } from '../_services/hardback.service';
import { Location } from '@angular/common';
import { PermissionService } from '../_services/permission.service';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { ModalController } from '@ionic/angular';
import { DefaultservicetimePage } from '../defaultservicetime/defaultservicetime.page';
import { StoreDefaultSlotsServices } from '../defaultservicetime/defaultservices.service';
import { MerchantServiceDetails } from '../addservices/addservices.model';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit, OnDestroy {
  noServiceAvailable: boolean;
  categories: MerchantServiceGroups[];
  serviceData: MerchantService[];
  allServices: MerchantService[];
  selectedIndex: any;

  defaultServiceData: MerchantServiceDetails;
  enableDefault: boolean;
  defaultMin: any;
  refreshSubscription = new Subject();
  constructor(
    public alertController: AlertController,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private listMerchantServiceService: ListMerchantServiceService,
    private imageService: ImageService,
    private storage: Storage,
    public sanitizer: DomSanitizer,
    private hardBackService: HardBackService,
    private sharedService: SharedService,
    private location: Location,
    private permissionService: PermissionService,
    private navCtrl: NavController,
    private nav: NavigationHandler,
    private defaultSlotServices: StoreDefaultSlotsServices,
    public modalController: ModalController
  ) {
    this.permissionService.checkPermissionAccess('SERVICE_MANAGEMENT').then(
      data => {
        if (!data) {
          this.navCtrl.navigateRoot('/login');
        }
      }
    );

  }
  async ngOnInit() {

    this.sharedService.currentServiceRefresh.pipe(takeUntil(this.refreshSubscription)).subscribe(async data => {
      const l = await this.loadingCtrl.create({
        spinner: 'bubbles',
        message: 'Please wait...',
        cssClass: 'custom-spinner',
      });
      l.present();
      this.enableDefault = false;
      this.defaultMin = 'Disabled';
      await this.getMerchantServices();
      await this.getDefaultMerchantServices();
      l.dismiss();
    });


    // BackToExit
    // this.hardBackService.backToExit();
  }
  getMerchantServices() {
    return new Promise((resolve, reject) => {
      this.listMerchantServiceService.getMerchantServices().subscribe(
        (data) => {
          if (data && data.status === 'SUCCESS') {
            this.categories = data.data;
            if (data.data.length > 0) {
              this.changeState(0);
              for (const s of this.categories) {
                // this.storage.get('https://bocxy-merchant-new.s3.ap-south-1.amazonaws.com/' + s.icon).then(d => {
                //   if (d) {
                //     s.iconLocal = d;
                //   }
                //   else {
                //     this.imageService.saveImage('https://bocxy-merchant-new.s3.ap-south-1.amazonaws.com/' + s.icon);
                //   }
                // });
                for (const ss of s.services) {
                  this.storage.get('https://bocxy-merchant-new.s3.ap-south-1.amazonaws.com/' + ss.serviceIcon).then(d => {
                    if (d) {
                      ss.serviceIconLocal = d;
                    }
                    else {
                      this.imageService.saveImage('https://bocxy-merchant-new.s3.ap-south-1.amazonaws.com/' + ss.serviceIcon);
                    }
                  });
                }
              }
            }
          } else {
            this.toast.showToast();
          }
          resolve(1);
        },
        (error) => {
          console.log(error);
          this.toast.showToast();
          reject(error);
        }
      );
    });
  }
  getDefaultMerchantServices() {
    return new Promise((resolve, reject) => {
      this.defaultSlotServices.getStoreDefaultSlots().subscribe(
        (data) => {
          // console.log(data);
          if (data && data.status === 'SUCCESS') {
            this.defaultServiceData = data.data;
            if (this.defaultServiceData.defaultSlot === 'Y') {
              this.enableDefault = true;
              console.log(this.enableDefault);
            } else {
              this.enableDefault = false;
              this.defaultMin = 'Disabled';
            }
            if (this.defaultServiceData.defaultSlotDuration === undefined) {
              this.defaultMin = 'Disabled';
            } else if (this.defaultServiceData.defaultSlotDuration) {
              this.DurationConversion(this.defaultServiceData.defaultSlotDuration);

            }
          } else {
            this.toast.showToast();
          }
          resolve(1);
        },
        (error) => {
          console.log(error);
          this.toast.showToast();
          reject(error);
        }
      );
    });
  }
  DurationConversion(duration) {
    const minutes = duration % 60;
    const hours = (duration - minutes) / 60;
    const durationmin = minutes.toString();
    const durationHour = hours.toString();
    console.log(hours + ':' + minutes);
    if (durationHour === '0') {
      this.defaultMin = this.defaultServiceData.defaultSlotDuration + ' Mins';
    } else {
      this.defaultMin = durationHour + ' Hr ' + durationmin + ' Mins ';
    }
  }
  toggleDetails(services) {
    if (services.showDetails) {
      services.showDetails = false;
    } else {
      services.showDetails = true;
    }
  }

  async presentAlertConfirm(index: number, subIndex: number) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete Service!',
      message: 'Do you want to disable this service?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: (no) => {
            console.log('disable Canceled!');
          },
        },
        {
          text: 'Yes',
          cssClass: 'secondary',
          handler: async () => {
            const loading = await this.loadingCtrl.create();
            loading.present();
            this.listMerchantServiceService
              .removeMerchantService(
                this.serviceData[index].categories[subIndex]
                  .merchantStoreServiceId
              )
              .subscribe(
                async (response) => {
                  loading.dismiss();
                  if (response && response.status === 'SUCCESS') {
                    if (response.data.assignedFlag) {
                      this.toast.showToast('Assigned services cannot be deleted');
                    }
                    else if (this.serviceData[index].categories.length === 1) {
                      this.serviceData.splice(index, 1);
                      this.toast.showToast('service deleted Sucessfully');
                    } else {
                      this.serviceData[index].categories.splice(subIndex, 1);
                      this.toast.showToast('service deleted Sucessfully');
                    }
                  } else {
                    this.toast.showToast();
                  }
                },
                async (err) => {
                  loading.dismiss();
                  this.toast.showToast();
                }
              );
          },
        },
      ],
    });

    await alert.present();
  }
  async processImage(imgUrl) {
    return await this.imageService.saveImage(imgUrl);
  }
  doRefresh(refresher) {
    this.getMerchantServices().then(data => { refresher.target.complete(); })
      .catch(err => {
        refresher.target.complete();
      });
  }

  gotoUrl(url: string) {
    this.nav.GoForward(url);
  }

  goBack(url: string) {
    this.nav.GoBackTo(url);
  }

  async openDefaultDuration(data: MerchantServiceDetails) {
    console.log(data, 'model details');
    const modal = await this.modalController.create({
      component: DefaultservicetimePage,
      cssClass: 'default-duration-modal',
      componentProps: {
        editData: data,
      },
    });
    return await modal.present();
  }


  // filterservice(ev: any) {
  //   this.serviceData = this.allServices;
  //   const val = ev.target.value;
  //   if (val && val.trim() !== '') {
  //     this.serviceData = this.serviceData.filter((ser) => {
  //       return (ser.service.toLowerCase().indexOf(val.toLowerCase()) > -1);
  //     });
  //   }
  // }
  ngOnDestroy() {
    this.refreshSubscription.next();
    this.refreshSubscription.unsubscribe();
  }
  changeState(index) {
    this.selectedIndex = index;
    this.serviceData = this.categories[index].services;
  }
}
