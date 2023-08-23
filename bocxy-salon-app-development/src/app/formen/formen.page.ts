import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Params, Router, ROUTER_CONFIGURATION } from '@angular/router';
import { AllServices } from './allServices.service';
import { ToastService } from '../_services/toast.service';
import { Storage } from '@ionic/storage';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { NavigationExtras } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-formen',
  templateUrl: './formen.page.html',
  styleUrls: ['./formen.page.scss'],
})
export class FormenPage implements OnInit {
  selectedIndex: any;
  selectedService: any;
  genderServiceList: any = [];
  serviceList: any = [];
  page: any;
  tempParam: string;
  queryParam: string;
  totalPages: number;
  totalCount: number;
  allServices: any = [];
  skipLogin: boolean;
  selectLocation: boolean;
  parentPage: string;
  serviceGroupId: number;
  constructor(
    private location: Location,
    public actionSheetController: ActionSheetController,
    public route: ActivatedRoute,
    private router: Router,
    private allService: AllServices,
    private loadingCtrl: LoadingController,
    private toast: ToastService,
    private storage: Storage,
    private nav: NavigationHandler,
    private alertCtrl: AlertController,
    public translate: TranslateService,
    public TranslateModule: TranslateModule
  ) { }

  categories;

  async ngOnInit() {
    this.page = 1;
    this.route.queryParams.subscribe(async params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.selectedService = this.router.getCurrentNavigation().extras.state.currentService;
        this.parentPage = this.router.getCurrentNavigation().extras.state['parent'];
        this.serviceGroupId = this.router.getCurrentNavigation().extras.state['serviceGroupId'];

        if (this.selectedService.name.toLowerCase() === 'for women' ||
          this.selectedService.name.toLowerCase() === 'for men' ||
          this.selectedService.name.toLowerCase() === 'for kids') {
          this.serviceList = await this.storage.get('serviceList');
          this.categories = this.serviceList;
          this.tempParam = `?serviceGenderCategoryId=${this.selectedService.serviceGenderCategoryId}`;

        } else if (this.selectedService.name === 'globalSearch') {
          if (this.selectedService.type === 'SERVICE') {
            this.tempParam = `?merchantStoreServiceId=${this.selectedService.serviceId}`;
          } else {
            const type = await this.storage.get('storeSelectionBy');
            if (type === 'store') {
              this.tempParam = '';
            } else {
              this.tempParam = `?merchantStoreId=${this.selectedService.storeId}`;
            }
          }
        }
        else {
          this.genderServiceList = await this.storage.get('genderService');
          this.categories = this.genderServiceList;
          this.tempParam = `?serviceId=${this.selectedService.serviceId}`;
        }

        const storeParam = await this.getStoreParameter();
        this.queryParam = this.tempParam = (this.tempParam.length > 2) ? `${this.tempParam}&${storeParam}` : `?${storeParam}`;

        await this.getStoreServices(this.page);
      }
      /* else {
        this.toast.showToast('Something went wrong. Please try again.');
      } */
    });

    this.storage.get('skipLogin').then(x => {
      if (x === 'Y') {
        this.skipLogin = true;
      }
    });
  }

  async getStoreServices(page?: any) {
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    return new Promise((resolve, reject) => {
      this.allService.getStoreServices(this.queryParam, page).subscribe(response => {
        loading.then(l => l.dismiss());
        if (response && response.status === 'SUCCESS') {
          this.allServices.push(...response.data);
          this.totalPages = response.totalPages;
          this.totalCount = response.totalCount;
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

  async changeState(index, selectedFilter) {
    this.selectedIndex = index;
    this.page = 1;
    this.allServices = [];
    this.totalPages = 0;
    this.totalCount = 0;
    if (selectedFilter.name.toLowerCase() === 'for women' ||
      selectedFilter.name.toLowerCase() === 'for men' ||
      selectedFilter.name.toLowerCase() === 'for kids') {
      this.queryParam = `${this.tempParam}&serviceGenderCategoryId=${selectedFilter.serviceGenderCategoryId}`;
      await this.getStoreServices(this.page);
    }
    else {
      this.queryParam = `${this.tempParam}&serviceId=${selectedFilter.serviceId}`;
      await this.getStoreServices(this.page);
    }
  }

  async loadMoreData(infiniteScroll) {
    this.page = this.page + 1;
    await this.getStoreServices(this.page);
    infiniteScroll.target.complete();
  }


  doRefresh(refresher) {
    this.allServices = [];
    this.page = 1;
    this.getStoreServices(this.page).then(data => {
      refresher.target.complete();
    }).catch(err => {
      refresher.target.complete();
    });
  }

  navigateToAllServices(service) {
    const data: NavigationExtras = { state: { currentService: service } };
    const url = '/seealltreatment';
    this.nav.GoForward(url, data);
  }

  async openFilter() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Filter by category',
      cssClass: 'filter-actionsheet',
      backdropDismiss: false,
      buttons: [{
        text: 'For Men',
        role: 'destructive',
        cssClass: 'formenbtn',
        icon: 'person-outline',
        handler: () => {
          console.log('For men clicked');
        }
      }, {
        text: 'For Women',
        icon: 'woman-outline',
        handler: () => {
          console.log('For women clicked');
        }
      }, {
        text: 'For Kids',
        icon: 'happy-outline',
        handler: () => {
          console.log('For kids');
        }
      }, {
        text: 'By Offers',
        icon: 'pricetag-outline',
        handler: () => {
          console.log('By offers clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  bookNow(id: number) {
    if (this.skipLogin) {
      this.partialSigninPrompt();
      this.storage.set('loginFromBookNow', `bookappointment/${id}`);
    }
    else {
      this.nav.GoForward(`bookappointment/${id}`);
      //this.toast.showToast("Under Development");
    }
  }
  previous() {
    this.nav.GoBackTo(`home/tabs/tab1`);
  }
  async partialSigninPrompt() {
    const alert = await this.alertCtrl.create({
      header: 'Sign In',
      message: 'Please Sign In and try again.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: () => {
            this.nav.GoForward('/login');
          }
        }
      ]
    });
    await alert.present();
  }

  async getStoreParameter(): Promise<string> {
    const type = await this.storage.get('storeSelectionBy');
    if (type === 'store') {
      this.selectLocation = true;
      const store = await this.storage.get('store');
      return `merchantStoreId=${store.storeId}`;
    }
    else if (type === 'location') {
      this.selectLocation = true;
      const location = await this.storage.get('locationCrypt');
      return `location=${location.location}`;
    } else {
      this.selectLocation = false;
      return '';
    }
  }
  gotoUrl(url: string) {
    this.nav.GoForward(url);
  }

  goBack() {
    if (this.parentPage === 'seemoreService') {
      this.nav.GoBackTo(`/seemoreservice/${this.serviceGroupId}`);
    }
    else {
      this.nav.GoBackTo('/home/tabs/tab1');
    }
  }

}
