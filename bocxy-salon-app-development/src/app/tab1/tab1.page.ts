import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, NavController, ModalController } from '@ionic/angular';
import { ImageService } from '../_services/image.service';
import { ToastService } from '../_services/toast.service';
import { DashboardService } from './tab1.service';
import { Storage } from '@ionic/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { NavigationExtras } from '@angular/router';
import { FindstorePage } from '../findstore/findstore.page';
import { GlobalsearchPage } from '../globalsearch/globalsearch.page';
import { CustomerNotificationService } from '../notifications/notfications.service';
import { SharedService } from '../_services/shared.service';
import { take } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  @ViewChild('homeSlider') slides: IonSlides;
  @ViewChild('brandSlider') brandslides: IonSlides;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1,
    autoplay: false
  };
  brandslideOpts = {
    initialSlide: 0,
    slidesPerView: 2,
    autoplay: false
  };
  skipLogin: boolean;
  lang: any;
  totalNotficationsCount: number;
  homeslides = [
    { servicename: 'Youthful Haircut', description: 'Haircuts are not merely new hairstyles, but a new you!', image: './assets/img/offer2.jpg' },
    { servicename: 'Bridal Makeup', description: 'Your fairy tale wedding is now a reality!', image: './assets/img/offer1.jpg' },
    { servicename: 'Soothing Facial (Women)', description: 'Nourish your skin and calm your mind with a soothing facial', image: './assets/img/offer3.jpg' }
  ];
  // popularservices = [
  //   { name: 'Makeup', icon: './assets/service_icons/makeup.svg' },
  //   { name: 'Facial', icon: './assets/service_icons/facial.svg' },
  //   { name: 'Massage', icon: './assets/service_icons/massage.svg' },
  //   { name: 'Haircut', icon: './assets/service_icons/haircut.svg' },
  // ];
  services = [];
  genderServiceList = [];
  storeName: string;
  serviceGroups: any[];
  constructor(
    private navCtrl: NavController,
    private dashboardService: DashboardService,
    private loadingCtrl: LoadingController,
    private toast: ToastService,
    private storage: Storage,
    private imageService: ImageService,
    public sanitizer: DomSanitizer,
    private Cservice: CustomerNotificationService,
    private nav: NavigationHandler,
    public modalController: ModalController,
    public translate: TranslateService,
    public TranslateModule: TranslateModule
  ) {
    this.lang = 'en';
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  async openLocationSearch() {
    const storeType = await this.storage.get('storeSelectionBy');
    const modal = await this.modalController.create({
      component: FindstorePage,
      cssClass: 'my-custom-class',
      componentProps: {
        storelocation: this.storeName,
        type: storeType
      }
    });
    modal.onWillDismiss().then(response => {
      if (response.data.type) {
        this.storage.set('storeSelectionBy', response.data.type);
        this.storeName = response.data.display;
        if (response.data.type === 'store') {
          this.storage.set('store', response.data);
        }
        else {
          this.storage.set('locationCrypt', response.data);
        }
      }
    });
    return await modal.present();
  }

  async openServiceSearch() {
    const modal = await this.modalController.create({
      component: GlobalsearchPage,
      cssClass: 'find-store-modal',
    });
    return await modal.present();
  }
  // ionViewWillLeave() {
  //   this.slides.stopAutoplay();
  // }
  // ionViewDidEnter() {
  //   this.slides.stopAutoplay();
  // }
  gotToNotifications() {
    if (this.skipLogin) {
      return;
    }
    this.navCtrl.navigateRoot('/notifications');
    //this.toast.showToast("Under Development");
  }

  async ngOnInit() {
    await this.displayStoreData();
    await this.getServicegroup();
    const xVal = await this.storage.get('skipLogin');
    if (xVal == 'Y') {
      this.skipLogin = true;
    }
    if (!this.skipLogin) {
      this.getNotificationsCount();
    }

  }

  getServicegroup() {
    return new Promise((resolve, reject) => {
      this.dashboardService.getServiceGroup().subscribe((response) => {
        if (response && response.status === 'SUCCESS') {
          this.serviceGroups = response.data;
        }
        else {
          this.toast.showToast('Something went wrong. Please try again');
        }
        resolve(1);
      },
        (error) => {
          this.toast.showToast('Something went wrong. Please try again');
          reject('error');
        });
    });
  }

  getService() {
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    return new Promise((resolve, reject) => {
      this.dashboardService.getServiceGenderCategoriesList().subscribe(
        (result) => {
          if (result && result.status === 'SUCCESS') {
            this.genderServiceList = result.data;
            this.storage.set('genderService', this.genderServiceList);
            for (const s of this.genderServiceList) {
              this.storage.get('https://bocxy-merchant-new.s3.ap-south-1.amazonaws.com/' + s.icon).then(d => {
                if (d) {
                  s.serviceIconLocal = d;
                }
                else {
                  this.imageService.saveImage('https://bocxy-merchant-new.s3.ap-south-1.amazonaws.com/' + s.icon);
                }
              });
            }
          }
          else {
            this.toast.showToast('Something went wrong. Please try again.');
          }
        },
        (error) => {
          this.toast.showToast('Something went wrong. Please try again');
          reject(error);
        }
      );
      this.dashboardService.getAllServices(null).subscribe(
        (response) => {
          loading.then(l => l.dismiss());
          if (response && response.status === 'SUCCESS') {
            this.services = response.data;
            this.storage.set('serviceList', this.services);
            for (const s of this.services) {
              this.storage.get('https://bocxy-merchant-new.s3.ap-south-1.amazonaws.com/' + s.icon).then(d => {
                if (d) {
                  s.serviceIconLocal = d;
                }
                else {
                  this.imageService.saveImage('https://bocxy-merchant-new.s3.ap-south-1.amazonaws.com/' + s.icon);
                }
              });
            }
          }
          else {
            this.toast.showToast('Something went wrong. Please try again.');
          }
          resolve(1);
        },
        (error) => {
          this.toast.showToast('Something went wrong. Please try again');
          reject(error);
        }
      );
    });
  }

  onServiceClick(service) {
    const data: NavigationExtras = { state: { currentService: service } };
    const url = '/formen';
    this.nav.GoForward(url, data);
  }
  getNotificationsCount() {
    if (!this.skipLogin) {
      const loading = this.loadingCtrl.create();
      loading.then((l) => l.present());
      return new Promise((resolve, reject) => {
        this.Cservice
          .getNotficationsCount()
          .pipe(take(1))
          .subscribe(
            (response) => {
              loading.then((l) => l.dismiss());
              if (response && response.status === 'SUCCESS') {
                this.totalNotficationsCount = response.data.count;
              } else {
                this.toast.showToast('Something went wrong. Please try again');
              }
              resolve(1);
            },
            (error) => {
              this.toast.showToast('Something went wrong. Please try again');
              reject(error);
            }
          );
      });
    }
  }

  async displayStoreData() {
    const type = await this.storage.get('storeSelectionBy');
    if (type === 'store') {
      const store = await this.storage.get('store');
      if (store != null) {
        this.storeName = store.display;
      }
    }
    else {
      const location = await this.storage.get('locationCrypt');
      if (location != null) {
        this.storeName = location.display;
      }
    }
  }
  goForward(url: string) {
    this.nav.GoForward(url);
  }
  doRefresh(refresher) {
    this.services = [];
    this.genderServiceList = [];
    this.getService().then(data => {
      refresher.target.complete();
    }).catch(err => {
      refresher.target.complete();
    });
  }
}


