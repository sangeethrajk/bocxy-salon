import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MenuController, NavController, AlertController, LoadingController, IonList, IonItemSliding } from '@ionic/angular';
import { Stylist } from './stylistmgmt.model';
import { ToastService } from '../_services/toast.service';
import { StylistManagementService } from './stylistmgmt.service';
import { ResolveEnd, Router } from '@angular/router';
import { PermissionService } from '../_services/permission.service';
import { StylistPermissionService } from '../stylistpermission/stylist-permission.service';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { SharedService } from '../_services/shared.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';


@Component({
  selector: 'app-stylistmgmt',
  templateUrl: './stylistmgmt.page.html',
  styleUrls: ['./stylistmgmt.page.scss'],
})
export class StylistmgmtPage implements OnInit {
  @ViewChild('slidingList') slidingList: IonList;
  noServiceAvailable: boolean;
  stylistData: Stylist[];
  refreshSubscription = new Subject();
  constructor(
    private _location: Location,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    public alertController: AlertController,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private stylistManagementService: StylistManagementService,
    private permissionService: PermissionService,
    private router: Router,
    private sharedService: SharedService,
    private stylistService: StylistPermissionService,
    private nav: NavigationHandler
  ) {
    this.permissionService.checkPermissionAccess('STYLIST_MANAGEMENT').then(
      data => {
        if (!data) {
          this.navCtrl.navigateRoot('/login');
        }
      }
    );
  }

  stylists = [
    { accountId: 1, isOpen: false, name: 'Manohar' },
    { accountId: 2, isOpen: false, name: 'Ram Kumar' },
    { accountId: 3, isOpen: false, name: 'Rajesh' },
    { accountId: 4, isOpen: false, name: 'Mahesh' },
    { accountId: 5, isOpen: false, name: 'Prabhakaran' },
    { accountId: 6, isOpen: false, name: 'Gopi' },
    { accountId: 7, isOpen: false, name: 'Suresh' },
  ];
  async ngOnInit() {
    this.sharedService.currentstyleManagmentRefresh.pipe(takeUntil(this.refreshSubscription)).subscribe(async data => {
      await this.manualRefresh();
    });
  }
  getStylists() {
    return new Promise((resolve, reject) => {
      // this.stylistData = this.stylists;
      // resolve(1);
      // return;

      this.stylistManagementService.getStylists().subscribe(
        (data) => {
          // console.log(data);
          if (data && data.status === 'SUCCESS') {
            this.stylistData = data.data;
          } else {
            this.toast.showToast();
          }
          resolve(1);
        },
        (error) => {
          console.log(error);
          this.toast.showToast();
          reject(error);
        }
      );
    });
  }

  slideOpened(items, stylist) {
    items.target.getSlidingRatio().then((res) => {
      const ratio = res;
      if (ratio >= 1) {
        stylist.isOpen = true;
      } else {
        stylist.isOpen = false;
      }
    });
  }
  clickSlides(e) {
    console.log(e);

  }
  async presentAlertConfirm(index: number) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete Staff!',
      message: 'Do you want to delete this Staff?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: (no) => {
            this.slidingList.closeSlidingItems();
            console.log('Delete Canceled!');
          },
        },
        {
          text: 'Yes',
          cssClass: 'secondary',
          handler: async () => {
            this.slidingList.closeSlidingItems();
            const loading = await this.loadingCtrl.create();
            loading.present();
            this.stylistManagementService
              .removeStylist(
                this.stylistData[index].accountId
              )
              .subscribe(
                async (response) => {
                  loading.dismiss();
                  if (response && response.status === 'SUCCESS') {
                    if (response.data.assignedFlag) {
                      this.toast.showToast('Assigned staffs cannot be deleted');
                    } else {
                      this.toast.showToast('Staff deleted Sucessfully!');
                      this.stylistData.splice(index, 1);
                    }
                  } else {
                    this.toast.showToast();
                  }
                },
                async (err) => {
                  loading.dismiss();
                  this.toast.showToast();
                }
              );
          },
        },
      ],
    });

    await alert.present();
  }
  gotToAddStylist() {
    this.gotoUrl('/addstylist');
  }

  previous() {
    this._location.back();
  }

  getPermissionAccess(id: any) {
    this.gotoUrl('/stylistpermission/' + id);
  }

  gotoUrl(url: string) {
    this.nav.GoForward(url);
  }

  goBack(url: string) {
    this.nav.GoBackTo(url);
  }
  doRefresh(refresher) {
    this.getStylists().then(data => { refresher.target.complete(); })
      .catch(err => {
        refresher.target.complete();
      });;
  }
  async manualRefresh() {
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Please wait...',
      cssClass: 'custom-spinner',
    });
    loading.present();
    try {
      await this.getStylists();
      loading.dismiss();
    } catch (err) {
      console.log('something went wrong: ', err);
      loading.dismiss();
    }
  }
  ngOnDestroy() {
    this.refreshSubscription.next();
    this.refreshSubscription.unsubscribe();
  }
}
