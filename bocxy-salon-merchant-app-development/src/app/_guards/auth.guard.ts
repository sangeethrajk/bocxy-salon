import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { NavController } from '@ionic/angular';
import { PermissionService } from '../_services/permission.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public navCtrl: NavController, private authService: AuthService, private permissionService: PermissionService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if ((await this.authService.isLoggedIn())) {
      // logged in so return true
      // console.log("routerstate:" + state + route);
      if (state.url == '/slotconfig') {
        this.permissionService.checkPermissionAccess('STYLIST_SLOT_CONFIGURATION').then(
          data => {
            if (!data) {
              this.navCtrl.navigateRoot(['/login']);
            }
          }
        );
      }
      else if (state.url == '/stylistmgmt') {
        this.permissionService.checkPermissionAccess('STYLIST_MANAGEMENT').then(
          data => {
            if (!data) {
              this.navCtrl.navigateRoot(['/login']);
            }
          }
        );
      }
      else if (state.url == '/tab2') {
        this.permissionService.checkPermissionAccess('SERVICE_MANAGEMENT').then(
          data => {
            if (!data) {
              this.navCtrl.navigateRoot(['/login']);
            }
          }
        );
      }

      // Banners Management route
      /* else if (state.url = '/tab2') {
        this.permissionService.checkPermissionAccess('BANNERS_MANAGEMENT').then(
          data => {
            if (!data) {
              this.navCtrl.navigateRoot(['/login']);
            }
          }
        )
      } */
      // StoreTime Management route
      /* else if (state.url = '/tab2') {
        this.permissionService.checkPermissionAccess('STORE_TIME_MANAGEMENT').then(
          data => {
            if (!data) {
              this.navCtrl.navigateRoot(['/login']);
            }
          }
        )
      } */
      // Appointment billing route
      /* else if (state.url = '/tab2') {
        this.permissionService.checkPermissionAccess('APPOINTMENT_BILLING').then(
          data => {
            if (!data) {
              this.navCtrl.navigateRoot(['/login']);
            }
          }
        )
      } */
      else if (state.url == '/tab4') {
        this.permissionService.checkPermissionAccess('CUSTOMER_MANAGEMENT').then(
          data => {
            if (!data) {
              this.navCtrl.navigateRoot(['/login']);
            }
          }
        );
      }
      else if (state.url == '/expenses') {
        this.permissionService.checkPermissionAccess('EXPENSE_MANAGEMENT').then(
          data => {
            if (!data) {
              this.navCtrl.navigateRoot(['/login']);
            }
          }
        );
      }
      else if (state.url == '/announcements') {
        this.permissionService.checkPermissionAccess('ANNOUNCEMENT_MANAGEMENT').then(
          data => {
            if (!data) {
              this.navCtrl.navigateRoot(['/login']);
            }
          }
        );
      }
      else if (state.url == '/tab1') {
        this.permissionService.checkPermissionAccess('REVENUE_STATUS').then(
          data => {
            if (!data) {
              this.navCtrl.navigateRoot(['/login']);
            }
          }
        );
      }
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.navCtrl.navigateRoot(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
