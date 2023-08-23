import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalSearchService } from './globalsearch.service';
import { Storage } from '@ionic/storage';
import { ToastService } from '../_services/toast.service';
import { NavigationExtras } from '@angular/router';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-globalsearch',
  templateUrl: './globalsearch.page.html',
  styleUrls: ['./globalsearch.page.scss'],
})
export class GlobalsearchPage implements OnInit {

  searchString: string;
  searchList = [];
  selectLocation: boolean;

  constructor(
    public modalCtrl: ModalController,
    private httpService: GlobalSearchService,
    private storage: Storage,
    private toast: ToastService,
    private nav: NavigationHandler,
    public translate: TranslateService,
    public TranslateModule: TranslateModule
  ) {
    this.getStoreParameter();
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  async getServiceOrStore() {
    if (this.searchString && this.searchString.length >= 3) {
      return new Promise(async (resolve, reject) => {
        const param = await this.getStoreParameter();
        const query = `search=${this.searchString}&${param}`;
        this.httpService.getStoreorServices(query).pipe().subscribe(
          (response) => {
            if (response && response.status === 'SUCCESS') {
              this.searchList = response.data;
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
  }

  async getStoreParameter(): Promise<string> {
    const type = await this.storage.get('storeSelectionBy');
    if (type === 'store') {
      this.selectLocation = true;
      const store = await this.storage.get('store');
      return `merchantStoreId=${store.storeId}`;
    } else if (type === 'location') {
      this.selectLocation = true;
      const location = await this.storage.get('locationCrypt');
      return `location=${location.location}`;
    } else {
      this.selectLocation = false;
      return '';
    }
  }

  storeSelected(store: any) {
    let service = {};
    if (store.type === 'SERVICE') {
      service = {
        name: 'globalSearch',
        serviceId: store.merchantStoreServiceId,
        type: store.type
      };
    }
    else {
      service = {
        name: 'globalSearch',
        storeId: store.merchantStoreId,
        type: store.type
      };
    }
    const data: NavigationExtras = { state: { currentService: service } };
    const url = '/formen';
    this.nav.GoForward(url, data);
    this.dismiss();

  }
}
