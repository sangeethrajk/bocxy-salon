import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ImageService } from '../_services/image.service';
import { ToastService } from '../_services/toast.service';
import { DashboardService } from '../tab1/tab1.service';
import { LoadingController } from '@ionic/angular';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { Storage } from '@ionic/storage';
import { NavigationExtras } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seemoreservice',
  templateUrl: './seemoreservice.page.html',
  styleUrls: ['./seemoreservice.page.scss'],
})
export class SeemoreservicePage implements OnInit {
  services = [];
  allServices = [];
  paramSubscription: Subscription;
  servicegoupId: number;
  constructor(
    private location: Location,
    private loadingCtrl: LoadingController,
    private dashboardService: DashboardService,
    private toast: ToastService,
    private storage: Storage,
    private imageService: ImageService,
    private nav: NavigationHandler,
    public sanitizer: DomSanitizer,
    public translate: TranslateService,
    public TranslateModule: TranslateModule,
    public route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.paramSubscription = this.route.params.subscribe(
      async (params: Params) => {
        // tslint:disable-next-line: no-string-literal
        if (params['serviceGroupId']) {
          this.services = [];
          this.getAllServices(null, params['serviceGroupId']);
          this.servicegoupId = Number(params['serviceGroupId']);
        }
        else {
          this.getAllServices(null);
        }
      });
  }

  getService() {
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    return new Promise((resolve, reject) => {
      this.dashboardService.getServiceGenderCategoriesList().subscribe(
        (result) => {
          if (result && result.status === 'SUCCESS') {
            this.services = result.data;
            this.storage.set('genderService', result.data);
          }
          else {
            this.toast.showToast('Something went wrong. Please try again.');
          }
          this.getAllServices(loading);
        },
        (error) => {
          this.toast.showToast('Something went wrong. Please try again');
          this.getAllServices(loading);
          reject(error);
        }
      );
    });
  }

  getAllServices(loading, serviceGroupId = null) {
    if (!loading) {
      loading = this.loadingCtrl.create();
      loading.then(l => l.present());
    }
    this.dashboardService.getAllServices(serviceGroupId).subscribe(
      (response) => {
        if (response && response.status === 'SUCCESS') {
          this.services.push(...response.data);
          this.allServices = this.services;
          this.storage.set('serviceList', response.data);
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
        loading.then(l => l.dismiss());
      },
      (error) => {
        this.toast.showToast('Something went wrong. Please try again');
        loading.then(l => l.dismiss());
      }
    );
  }

  onServiceClick(service) {
    const data: NavigationExtras = { state: { currentService: service, parent: 'seemoreService', serviceGroupId: this.servicegoupId } };
    const url = '/formen';
    this.nav.GoForward(url, data);
  }


  doRefresh(refresher) {
    this.services = [];
    this.getService().then(data => {
      refresher.target.complete();
    }).catch(err => {
      refresher.target.complete();
    });
  }

  filterservice(ev: any) {
    this.services = this.allServices;
    const val = ev.target.value;
    if (val && val.trim() !== '') {
      this.services = this.services.filter((ser) => {
        return (ser.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }

  previous() {
    this.nav.GoBackTo('/home/tabs/tab1');
  }
}
