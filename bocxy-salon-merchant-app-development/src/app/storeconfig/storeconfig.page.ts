import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { ModalController } from '@ionic/angular';
import { MystorehelpPage } from '../mystorehelp/mystorehelp.page';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-storeconfig',
  templateUrl: './storeconfig.page.html',
  styleUrls: ['./storeconfig.page.scss'],
})
export class StoreconfigPage implements OnInit {
  roleCode: string;


  constructor(
    private location: Location,
    private nav: NavigationHandler,
    private storage: Storage,
    public modalController: ModalController
  ) {
    this.validations();
  }


  storeConfigList = [
    { name: 'Calendar Settings', dbName: 'STORE_TIME_MANAGEMENT', description: 'Manage your store timing,slots etc.', icon: 'calendar-outline', url: '/calendarsettings', disabled: false },
    // { name: 'Store Time Management', description: 'Manage your store open or close timing', icon: 'time-outline', url: '/storetimemgmt', disabled: false },
    { name: 'Stylist Grade Management', dbName: 'STYLIST_GRADE_MANAGEMENT', description: `Define your stylist's grade`, icon: 'medal-outline', url: '/grademgmt', disabled: false },
    { name: 'Staff Management', dbName: 'STYLIST_MANAGEMENT', description: 'Manage your staffs', icon: 'man-outline', url: '/stylistmgmt', disabled: false },
    { name: 'Appointment Settings', dbName: 'STYLIST_SLOT_CONFIGURATION', description: 'Manage your appointments, slots etc.', icon: 'settings-outline', url: '/slotconfig', disabled: false },
    { name: 'My Services', dbName: 'SERVICE_MANAGEMENT', description: 'Manage your Service, Price, Offers etc.', icon: 'briefcase-outline', url: '/tab2', disabled: false },
    { name: 'Offers Management', dbName: 's', description: 'Manage your offers, ad banners etc.', icon: 'pricetags-outline', url: '/offersmgmt', disabled: true },
    { name: 'Store Holiday Management', dbName: 'HOLIDAY_MANAGEMENT', description: 'Manage your store holidays', icon: 'today-outline', url: '/holidaylist', disabled: false }
  ];


  ngOnInit() {

  }
  async openHelpOverlay() {
    const modal = await this.modalController.create({
      component: MystorehelpPage,
      cssClass: 'mystore-help-overlay'
    });
    return await modal.present();
  }

  gotoUrl(url: string) {
    this.nav.GoForward(url);
  }

  previous() {
    this.location.back();
  }

  validations() {
    this.storage.get('userData').then(x => {
      this.roleCode = x.roleCodes;
      if (!this.roleCode.includes('MR')) {
        if (x.permissions && x.permissions.length > 0) {
          for (let j = 0; j < this.storeConfigList.length; j++) {
            if (x.permissions.includes(this.storeConfigList[j].dbName)) {
              this.storeConfigList[j].disabled = false;
            }
            else {
              this.storeConfigList[j].disabled = true;

            }
          }
        }
      }
    }
    )
  }
}
