import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { ToastService } from '../_services/toast.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  userData: any;
  selectedIcon: any = 'assets/icon/male_icon.svg';

  constructor(
    private storage: Storage,
    private nav: NavigationHandler,
    private toast: ToastService,
    public translate: TranslateService,
    public TranslateModule: TranslateModule
  ) { }

  async ngOnInit() {
    await this.loadUserData();
  }

  async loadUserData() {
    this.userData = await this.storage.get('userData');
    if (this.userData.pictureUrl == null) {
      this.selectedIcon = 'assets/icon/male_icon.svg';
    } else {
      this.selectedIcon = this.userData.pictureUrl;
    }
  }
  goToLocation(url: string) {
    if (url === "none")
      this.toast.showToast("Under Development");
    else
      this.nav.GoForward('/' + url);
  }
  previous() {
    this.nav.GoBackTo('/home/tabs/tab1');
  }
  gotoUrl(url: string) {
    this.nav.GoForward(url);
  }

  goBack(url: string) {
    this.nav.GoBackTo(url);
  }
}
