import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { detailAnnoucementCustomer } from './detailannoucement.model';
import { detailAnnoucementService } from './detailannouncement.service';
import { ToastService } from '../_services/toast.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { SharedService } from '../_services/shared.service';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';


@Component({
  selector: 'app-detailannouncement',
  templateUrl: './detailannouncement.page.html',
  styleUrls: ['./detailannouncement.page.scss'],
})
export class DetailannouncementPage implements OnInit {
  annoucement: detailAnnoucementCustomer;
  annoucementId: number;
  constructor(
    private httpService: detailAnnoucementService,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private nav: NavigationHandler,
    public route: ActivatedRoute,
    private location: Location
  ) { }
  paramSubscription: Subscription;
  async ngOnInit() {
    this.paramSubscription = this.route.params.subscribe(
      async (params: Params) => {
        // tslint:disable-next-line: no-string-literal
        if (params['annoucementId']) {
          this.annoucementId = params.annoucementId;
          await this.getAnnoucementDetails(this.annoucementId);
        }
      });

  }

  getAnnoucementDetails(id: number) {
    return new Promise((resolve, reject) => {
      const loading = this.loadingCtrl.create();
      loading.then(l => l.present());
      this.httpService.getAnnoucementDetails(id).pipe().subscribe(
        (response) => {
          loading.then(l => l.dismiss());
          this.annoucement = response.data[0];
          console.log(this.annoucement);
          resolve(1);
        },
        (error) => {
          loading.then(l => l.dismiss());
          this.toast.showToast('Something went wrong. Please try again');
          reject(error);
        });
    });
  }
  dateFormat(date): string {
    // Split timestamp into [ Y, M, D, h, m, s ]
    let t = date.split(/[- :]/);

    let d = new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);
    function pad(s) {
      return s < 10 ? "0" + s : s;
    }
    let dateRes = [
      pad(d.getDate()),
      pad(d.getMonth() + 1),
      d.getFullYear(),
    ].join("/");
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    let strTime = dateRes + " " + pad(hours) + ":" + pad(minutes) + " " + ampm;
    return strTime;
  }
  previous() {
    this.location.back();
  }
}
