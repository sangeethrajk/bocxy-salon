import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { AllServices } from '../formen/allServices.service';
import { ToastService } from '../_services/toast.service';
import { Storage } from '@ionic/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationHandler } from '../_services/navigation-handler.service';

@Component({
  selector: 'app-seealltreatment',
  templateUrl: './seealltreatment.page.html',
  styleUrls: ['./seealltreatment.page.scss'],
})
export class SeealltreatmentPage implements OnInit {
  selectedService: any;
  page: any;
  serviceList: any = [];
  totalPages: number;
  totalCount: number;
  queryParam: string;
  searchString: string;
  merchantStore: any;

  constructor(
    private location: Location,
    private allService: AllServices,
    private loadingCtrl: LoadingController,
    private toast: ToastService,
    private storage: Storage,
    public route: ActivatedRoute,
    private router: Router,
    private nav: NavigationHandler
  ) { }

  /* serviceList = [
    { servicename: 'Youthful Haircut', storename: 'Naturals Salon', img: '/assets/img/haircut2.jpg', storetype: 'Shop', location: 'Ambattur, Chennai', stars: '4.5 (453)', price: '899', storetime: '30 mins' },
    { servicename: 'Mens Facial', storename: 'Tony & Guy', img: '/assets/img/mensfacial.jpg', storetype: 'Shop', location: 'Adayar, Chennai', stars: '4.5 (453)', price: '1099', storetime: '30 mins' },
    { servicename: 'Beauty Treatment', storename: 'Modern Hairdressers', img: '/assets/img/beautytreatment.jpg', storetype: 'Shop', location: 'Anna nagar, Chennai', stars: '4.5 (453)', price: '1299', storetime: '30 mins' }
  ]; */
  ngOnInit() {
    this.page = 1;

    this.route.queryParams.subscribe(async params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.selectedService = await this.router.getCurrentNavigation().extras.state.currentService;
        this.queryParam = `?merchantStoreId=${this.selectedService.merchantStoreId}`;
        await this.getStoreServices(this.page);
        await this.getMerchantStore(this.selectedService.merchantStoreId);
      }

    });
  }


  getMerchantStore(merchantStoreId: any) {
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    return new Promise((resolve, reject) => {
      this.allService.getMerchantStore(merchantStoreId).subscribe(response => {
        loading.then(l => l.dismiss());
        if (response && response.status === 'SUCCESS') {
          this.merchantStore = response.data;
        }
        else {
          this.toast.showToast('Something went wrong. Please try again.');
        }
        resolve(1);
      },
        (error) => {
          this.toast.showToast('Something went wrong. Please try again');
          reject(error);
        });
    });
  }

  getStoreServices(page?: any) {
    let query;
    if (this.searchString && this.searchString.length >= 3) {
      query = `${this.queryParam}&search=${this.searchString}`;
    }
    else {
      query = this.queryParam;

    }
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    return new Promise((resolve, reject) => {
      this.allService.getStoreServices(query, page).subscribe(response => {
        loading.then(l => l.dismiss());
        if (response && response.status === 'SUCCESS') {
          this.serviceList.push(...response.data);
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
        });
    });
  }


  async getServiceOrStore() {
    this.page = 1;
    let query;
    if (this.searchString && this.searchString.length >= 3) {
      query = `${this.queryParam}&search=${this.searchString}`;
    }
    else {
      query = this.queryParam;

    }
    return new Promise(async (resolve, reject) => {
      this.allService.getStoreServices(query, this.page).pipe().subscribe(
        (response) => {
          if (response && response.status === 'SUCCESS') {
            this.serviceList = response.data;
            this.totalPages = response.totalPages;
            this.totalCount = response.totalCount;
          }
          else {
            this.toast.showToast('Failed to get serach data. Please try again');
          }
          resolve(1);
        },
        (error) => {
          this.toast.showToast('Something went wrong. Please try again');
          reject(1);
        }
      );
    });

  }


  doRefresh(refresher) {
    this.page = 1;
    this.totalPages = 0;
    this.totalCount = 0;
    this.serviceList = [];
    this.getStoreServices(this.page).then(data => {
      refresher.target.complete();
    }).catch(err => {
      refresher.target.complete();
    });
  }

  loadMoreData(infiniteScroll) {
    this.page = this.page + 1;
    this.getStoreServices(this.page).then(data => {
      infiniteScroll.target.complete();
      if (this.serviceList.length >= this.totalCount) {
        infiniteScroll.target.disabled = true;
      }
    }).catch(error => { infiniteScroll.target.complete(); });
  }

  bookNow(id: number) {
    this.nav.GoForward(`bookappointment/${id}`);
    // this.toast.showToast("Under Development");
  }
  previous() {
    console.log("back buttonn");

    this.nav.GoBackTo('/formen');
  }
}
