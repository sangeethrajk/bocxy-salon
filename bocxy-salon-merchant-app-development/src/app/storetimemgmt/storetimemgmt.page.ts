import { Component, OnInit, ViewChild } from '@angular/core';
import { StoreSlot } from './StoreSlot.model';
import { Router } from '@angular/router';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-storetimemgmt',
  templateUrl: './storetimemgmt.page.html',
  styleUrls: ['./storetimemgmt.page.scss'],
})
export class StoretimemgmtPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  storeslots = 'permanent';

  constructor(
    public router: Router,
    private nav: NavigationHandler) {

  }
  storeConfigList: StoreSlot[];

  ngOnInit() {
  }

  gotoUrl(url: string) {
    this.nav.GoForward(url);
  }

  goBack(url: string) {
    this.nav.GoBackTo(url);
  }

  getNowUTC() {
    const now = new Date();
    return new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
  }


  scrollToTop() {
    this.content.scrollToTop();
  }

  async segmentChanged(ev) {
    this.scrollToTop();

  }

  navigate(slotType: string) {
    const param = { type: slotType, data: null };
    this.router.navigateByUrl('/storetimecreate', { state: param });
  }
}
