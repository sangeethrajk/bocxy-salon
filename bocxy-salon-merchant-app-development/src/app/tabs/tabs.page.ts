import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SharedService } from '../_services/shared.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  roleCode: string;
  disableStore = false;
  disableCustomer: boolean;
  // overlayHidden = false;

  constructor(
    private storage: Storage,
    private sharedService: SharedService
  ) { }
  // public hideOverlay() {
  //   this.overlayHidden = true;
  // }
  ngOnInit() {
    this.storage.get('userData').then(x => {
      this.roleCode = x.roleCodes;
      if (!this.roleCode.includes('MR')) {
        if (x.permissions && x.permissions.length > 0) {
          if (
            (!x.permissions.includes('SERVICE_MANAGEMENT')) &&
            (!x.permissions.includes('STYLIST_MANAGEMENT')) &&
            (!x.permissions.includes('STYLIST_SLOT_CONFIGURATION')) &&
            (!x.permissions.includes('BANNERS_MANAGEMENT')) &&
            (!x.permissions.includes('STORE_TIME_MANAGEMENT'))) {
            this.disableStore = true;
          }
          else {
            this.disableStore = false;
          }
          if (!x.permissions.includes('CUSTOMER_MANAGEMENT')) {
            this.disableCustomer = true;
          }
          else {
            this.disableCustomer = false;
          }
        }
        else {
          this.disableStore = true;
          this.disableCustomer = true;
        }
      }
      else {
        this.disableStore = false;
        this.disableCustomer = false;
      }
    });
  }

  onTab3Select() {
    this.sharedService.changeAppointmentBookingDateRefresh(1);
  }

}
