import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { GlobalsearchPage } from '../globalsearch/globalsearch.page';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  skipLogin: boolean;
  lang: any;
  constructor(private storage: Storage, private modalController: ModalController, public translate: TranslateService,
    public TranslateModule: TranslateModule,
    public navCtrl: NavController,
  ) {
    this.lang = 'en';
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  ngOnInit() {
    this.storage.get('skipLogin').then(x => {
      if (x == 'Y') {
        this.skipLogin = true;
      }
    });
  }
  async openServiceSearch() {
    const modal = await this.modalController.create({
      component: GlobalsearchPage,
      cssClass: 'find-store-modal',
    });
    return await modal.present();
  }
  gotoLogin(e) {
    if (this.skipLogin) {
      e.preventDefault();
      e.stopPropagation();
      this.navCtrl.navigateRoot('/login');
      return false;
    }
  }
}
