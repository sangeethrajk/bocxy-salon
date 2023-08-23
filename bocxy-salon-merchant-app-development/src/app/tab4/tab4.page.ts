import { Component, OnInit, ViewChild } from '@angular/core';

import { NavController, LoadingController, ModalController, IonInfiniteScroll, AlertController, IonSlides } from '@ionic/angular';
import { MerchantCustomerServices } from './tab4.service';
import { MerchantCustomerService } from './tab4.model';
import { Router } from '@angular/router';
import { ToastService } from '../_services/toast.service';
import { PermissionService } from '../_services/permission.service';
import { IonContent } from '@ionic/angular';
@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  @ViewChild('slides', { static: false }) slider: IonSlides;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) content: IonContent;
  public onlineOffline = navigator.onLine;
  Regular: MerchantCustomerService[] = [];
  Visited: MerchantCustomerService[] = [];
  customers = 0;
  // selectedSlide: any;
  errorMessage: string;
  pageVisited: number;
  perPageVisited = 0;
  totalDataVisited = 0;
  totalPageVisited = 0;
  pageRegular: number;
  perPageRegular = 0;
  totalDataRegular = 0;
  totalPageRegular = 0;

  sliderOptions = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1
  };



  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private toast: ToastService,
    private merchantcustomerservices: MerchantCustomerServices,
    private alertController: AlertController,
    public router: Router,
    private permissionService: PermissionService,
  ) {
    document.addEventListener('online', () => { this.onlineOffline = true; });
    document.addEventListener('offline', () => { this.onlineOffline = false; });
    (async () => {
      if (this.onlineOffline) {

        this.permissionService.checkPermissionAccess('CUSTOMER_MANAGEMENT').then(
          data => {
            if (!data) {
              this.navCtrl.navigateRoot('/login');
            }
          }
        );
        await this.getVisitedCustomers();
        await this.getRegularCustomers();
      } else {
        this.toast.showToast('No Internet Connection');
      }
    })();

  }

  ngOnInit() {
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  async segmentChanged(ev) {
    this.scrollToTop();
    // await this.selectedSlide.slideTo(this.customers);
    console.log(this.customers);

  }

  // async slidesChanged(slides: IonSlides) {
  //   this.selectedSlide = slides;
  //   slides.getActiveIndex().then(selectedIndex => {
  //     this.customers = selectedIndex;

  //   }
  //   );
  // }

  getVisitedCustomers() {
    return new Promise((resolve, reject) => {
      this.pageVisited = 1;
      this.errorMessage = undefined;
      this.merchantcustomerservices.getVisitedCustomers({ page: this.pageVisited }).subscribe(data => {
        if (data && data.status === 'SUCCESS') {
          this.Visited = data.data;
          this.perPageVisited = data.perPage;
          this.totalDataVisited = data.totalCount;
          this.totalPageVisited = data.totalPages;

        } else {
          this.errorMessage = 'Failed to load data';
          this.Visited = undefined;
        }
        resolve(1);
      }, error => {
        console.log(error);
        this.errorMessage = (error as any);
        this.Visited = undefined;
        reject(error);
      });
    });
  }
  getRegularCustomers() {
    return new Promise((resolve, reject) => {
      this.pageRegular = 1;
      this.errorMessage = undefined;
      this.merchantcustomerservices.getRegularCustomers({ page: this.pageRegular }).subscribe(data => {

        if (data && data.status === 'SUCCESS') {
          this.Regular = data.data;
          this.perPageRegular = data.perPage;
          this.totalDataRegular = data.totalCount;
          this.totalPageRegular = data.totalPages;

        } else {
          this.errorMessage = 'Failed to load data';
          this.Regular = undefined;
        }
        resolve(1);
      }, error => {
        console.log(error);
        this.errorMessage = (error as any);
        this.Regular = undefined;
        reject(error);
      });
    });
  }

  loadMoreData(infiniteScroll) {
    this.pageVisited = this.pageVisited + 1;
    console.log(this.pageVisited);

    this.merchantcustomerservices.getVisitedCustomers({ page: this.pageVisited })
      .subscribe(
        data => {
          console.log('Async operation has ended');
          infiniteScroll.target.complete();
          if (data && data.status === 'SUCCESS') {
            this.perPageVisited = data.perPage;
            this.totalDataVisited = data.totalCount;
            this.totalPageVisited = data.totalPages;
            this.Visited.push(...data.data);
            this.errorMessage = undefined;
            if (this.Visited.length >= this.totalDataVisited) {
              infiniteScroll.target.disabled = true;
            }
          } else {
            this.errorMessage = 'Failed to load data';
          }
        },
        error => {
          console.log('Async operation has ended');
          infiniteScroll.target.complete();
          this.errorMessage = (error as any);
        }
      );
  }

  loadMoreDataRegular(infiniteScroll) {
    this.pageRegular = this.pageRegular + 1;
    console.log(this.pageRegular + 'regular');
    this.merchantcustomerservices.getRegularCustomers({ page: this.pageRegular })
      .subscribe(
        data => {
          console.log('Async operation has ended');
          infiniteScroll.target.complete();
          if (data && data.status === 'SUCCESS') {
            this.perPageRegular = data.perPage;
            this.totalDataRegular = data.totalCount;
            this.totalPageRegular = data.totalPages;
            this.Visited.push(...data.data);
            this.errorMessage = undefined;
            if (this.Visited.length >= this.totalDataRegular) {
              infiniteScroll.target.disabled = true;
            }
          } else {
            this.errorMessage = 'Failed to load data';
          }
        },
        error => {
          console.log('Async operation has ended');
          infiniteScroll.target.complete();
          this.errorMessage = (error as any);
        }
      );
  }

  doRefresh(refresher) {
    this.getVisitedCustomers().then(data => {
      this.getRegularCustomers().then(data1 => {
        refresher.target.complete();
      }).catch(err => {
        refresher.target.complete();
      });
    }).catch(err => {
      refresher.target.complete();
    });

  }
}
