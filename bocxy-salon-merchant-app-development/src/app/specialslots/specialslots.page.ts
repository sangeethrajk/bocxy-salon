import { Component, OnInit } from '@angular/core';
import { StoreSpecialSlot } from '../storetimemgmt/StoreSlot.model';
import { LoadingController, AlertController } from '@ionic/angular';
import { SpecialSlotService } from './specialslot.service';
import { ToastService } from '../_services/toast.service';
import { Router } from '@angular/router';
import { SharedService } from '../_services/shared.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-specialslots',
  templateUrl: './specialslots.page.html',
  styleUrls: ['./specialslots.page.scss'],
})
export class SpecialslotsPage implements OnInit {

  constructor(
    private loadingCtrl: LoadingController,
    private httpService: SpecialSlotService,
    private toast: ToastService,
    public router: Router,
    private alertController: AlertController,
    private sharedService: SharedService,
  ) {
  }

  storeConfigList: StoreSpecialSlot[];
  refreshSubscription = new Subject();

  ngOnInit() {
    this.sharedService.currentSpecialSlotTimeManagementRefresh.pipe(takeUntil(this.refreshSubscription)).subscribe(async data => {
      this.storeConfigList = [];
      this.getMerchantSpecialSlots();
    });
  }

  getMerchantSpecialSlots() {
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    const slots = this.httpService.GetMerchanSpecialtSlots().subscribe(
      (response) => {
        loading.then(l => l.dismiss());
        if (response && response.status === 'SUCCESS') {
          const currentDate = new Date();
          // tslint:disable-next-line: no-shadowed-variable
          const slots = response.data;
          for (const slot of slots) {
            slot.isActive = (currentDate >= new Date(slot.startDate) && (!slot.endDate || currentDate <= new Date(slot.endDate)));
          }
          this.storeConfigList = slots;
        }
        else {
          this.toast.showToast('Something went wrong, Please try again');
        }

      });
  }

  navigate(item: StoreSpecialSlot) {
    const param = { type: 'special', data: item };
    this.router.navigateByUrl('/storetimecreate', { state: param });
  }

  doRefresh(refresher) {
    this.getMerchantSpecialSlots();
    refresher.target.complete();
  }

  async presentDeleteAlertConfirm(slot: StoreSpecialSlot, index: number) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete Grade',
      message: 'Do you want to Delete the slot?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: (no) => {
            console.log('Deletion Canceled!');
          },
        },
        {
          text: 'Yes',
          cssClass: 'secondary',
          handler: async () => {
            const loading = this.loadingCtrl.create();
            loading.then(l => l.present());
            this.httpService.DeleteSpecialSlot(slot.merchantSpecialSlotId).subscribe(
              (response) => {
                loading.then(l => l.dismiss());
                if (response && response.data && response.status === 'SUCCESS') {
                  this.storeConfigList.splice(index, 1);
                }
                else {
                  this.toast.showToast('Failed to delete the slot. Please try again later');
                }
              }
            );
          }
        }
      ],
    });

    await alert.present();
  }
  ngOnDestroy() {
    this.refreshSubscription.next();
    this.refreshSubscription.unsubscribe();
  }
}
