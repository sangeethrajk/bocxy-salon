import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  NavController,
  LoadingController,
  AlertController,
} from '@ionic/angular';
import { CreategradePage } from '../creategrade/creategrade.page';
import { GradeMgmtService } from './grademgmt.service';
import { StylistGrade } from '../_models/stylistgrade.model';
import { ToastService } from '../_services/toast.service';
import { take, takeUntil } from 'rxjs/operators';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { SharedService } from '../_services/shared.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-grademgmt',
  templateUrl: './grademgmt.page.html',
  styleUrls: ['./grademgmt.page.scss'],
})
export class GrademgmtPage implements OnInit {
  gradeList: StylistGrade[] = [];
  page: number;
  totalGradeCount: number;
  totalPages: number;
  refreshSubscription = new Subject();

  constructor(
    public modalController: ModalController,
    private gradeService: GradeMgmtService,
    public navCtrl: NavController,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private sharedService: SharedService,
    private alertController: AlertController,
    private nav: NavigationHandler
  ) {
  }

  async ngOnInit() {
    this.sharedService.currentgradeManagmentRefresh.pipe(takeUntil(this.refreshSubscription)).subscribe(async (data) => {
      // if (data) {
      console.log("manual shared service", data);
      this.manualRefresh();
      // }
    });
  }

  async presentModal(data: StylistGrade) {
    console.log(data);

    const modal = await this.modalController.create({
      component: CreategradePage,
      cssClass: 'my-custom-class',
      componentProps: {
        editData: data,
      },
    });
    return await modal.present();
  }
  manualRefresh() {
    this.page = 1;
    this.totalPages = 0;
    this.totalGradeCount = 0;
    this.gradeList = [];
    this.getGrade(this.page);
  }
  gotoUrl(url: string) {
    this.nav.GoForward(url);
  }

  goBack(url: string) {
    this.nav.GoBackTo(url);
  }

  getGrade(page: number) {
    const loading = this.loadingCtrl.create();
    loading.then((l) => l.present());
    return new Promise((resolve, reject) => {
      this.gradeService
        .GetGrades(page)
        .pipe(take(1))
        .subscribe(
          (response) => {
            loading.then((l) => l.dismiss());
            if (response && response.status === 'SUCCESS') {
              this.gradeList.push(...response.data);
              this.totalPages = response.totalPages;
              this.totalGradeCount = response.totalCount;
            } else {
              this.toast.showToast('Something went wrong. Please try again');
            }
            resolve(1);
          },
          (error) => {
            this.toast.showToast('Something went wrong. Please try again');
            reject(error);
          }
        );
    });
  }

  doRefresh(refresher) {
    this.page = 1;
    this.totalPages = 0;
    this.totalGradeCount = 0;
    this.gradeList = [];
    this.getGrade(this.page).then(data => {
      refresher.target.complete();
    }).catch(err => {
      refresher.target.complete();
    });
  }

  loadMoreData(infiniteScroll) {
    this.page = this.page + 1;
    this.getGrade(this.page).then(data => {
      infiniteScroll.target.complete();
      if (this.gradeList.length >= this.totalGradeCount) {
        infiniteScroll.target.disabled = true;
      }
    }).catch(error => { infiniteScroll.target.complete(); });
  }

  async presentDeleteAlertConfirm(grade: StylistGrade, index: number) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete Grade',
      message: 'Do you want to Delete the Grade?',
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
            loading.then((l) => l.present());
            this.gradeService
              .DeleteGrade(grade.professionistGradeId)
              .subscribe((response) => {
                loading.then((l) => l.dismiss());
                if (response && response.status === 'SUCCESS') {
                  if (response.data.assignedFlag) {
                    this.toast.showToast('Grade cannot be deleted');
                  } else {
                    this.toast.showToast('Grade Deleted');
                    this.gradeList.splice(index, 1);
                  }
                } else {
                  this.toast.showToast(
                    'Something went wrong. Please try again'
                  );
                }
              });
          },
        },
      ],
    });

    await alert.present();
  }
  ngOnDestroy() {
    this.refreshSubscription.next();
    this.refreshSubscription.unsubscribe();
  }
}
