import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { ToastService } from '../_services/toast.service';
import { AppointmentDetail } from './detailappointment.model';
import { DetailAppointmentService } from './detailappointment.service';
import { AppointmentListService } from '../_services/appointmentlist.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { SharedService } from '../_services/shared.service';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { Time } from '../_models/Time.model';
import { Storage } from '@ionic/storage';
import { DateService } from '../_services/date.service';

@Component({
  selector: 'app-detailappointment',
  templateUrl: './detailappointment.page.html',
  styleUrls: ['./detailappointment.page.scss'],
})
export class DetailappointmentPage implements OnInit {

  constructor(
    public route: ActivatedRoute,
    private toast: ToastService,
    private httpService: DetailAppointmentService,
    private appointmentService: AppointmentListService,
    public alertController: AlertController,
    private loadingCtrl: LoadingController,
    private sharedService: SharedService,
    private nav: NavigationHandler,
    private storage: Storage,
    public dateService: DateService
  ) {
    this.storage.get('userData').then(x => {
      if (x) {
        this.userData = x;
      }
    });
  }

  paramSubscription: Subscription;
  appointment: AppointmentDetail;
  lastStatus: string;
  cancelReason: string;
  isReadOnly: boolean;
  appointmentEndTime: string;
  appointmentStartTime: string;
  userData: any;

  ngOnInit() {
    this.isReadOnly = false;
    this.paramSubscription = this.route.params.subscribe(
      async (params: Params) => {
        // tslint:disable-next-line: no-string-literal
        if (params['appointmentId']) {
          this.getAppointmentDetails(Number(params.appointmentId));
        } else {
          this.toast.showToast('Something went wrong. Please try again');
        }
      });
  }

  getAppointmentDetails(id: number) {
    const loading = this.loadingCtrl.create();
    loading.then((l) => l.present());
    this.httpService.getAppointmentDetails(id).subscribe((response) => {
      loading.then((l) => l.dismiss());
      if (response && response.status === 'SUCCESS') {
        this.appointment = response.data;
        let totalDuration = 0;
        for (const service of this.appointment.bookedServices) {
          if (!service.stylist) {
            service.stylist = this.appointment.stylistName;
          }

          if (service.duration < 60) {
            service.totalDuration = `${service.duration} min`;
          }
          else {
            service.totalDuration = (service.duration % 60) === 0 ? `${Math.trunc(service.duration / 60)}h` : `${Math.trunc(service.duration / 60)}h ${service.duration % 60}min`;
          }
          totalDuration = totalDuration + service.duration;
        }
        const startTime = new Time(this.appointment.slotName);
        const closeTime = new Time(this.appointment.slotName);
        closeTime.addMinutes(totalDuration);
        this.appointmentStartTime = startTime.toShortTime();
        this.appointmentEndTime = closeTime.toShortTime();
        this.lastStatus = this.appointment.status;
        this.isReadOnly = (this.appointment.status === 'CANCELED' || this.appointment.status === 'COMPLETED');
      }
      else {
        this.toast.showToast('Something went wrong plesase try again');
      }
    });
  }

  async presentCancelAlertConfirm() {
    if (this.appointment.status === 'CANCELED') {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Cancel Appointment',
        message: 'Do you want to cancel appointment?',
        inputs: [
          {
            name: 'Reason',
            type: 'textarea',
            placeholder: 'Cancellation Remarks',
            cssClass: 'alertTextBox'
          }],
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: (no) => {
              this.appointment.status = this.lastStatus;
              console.log('cancel Canceled!');
            },
          },
          {
            text: 'Yes',
            cssClass: 'secondary',
            handler: async (data) => {
              this.cancelReason = data.Reason;
            },
          },
        ]
      });

      await alert.present();
    }
    else {
      this.cancelReason = null;
    }
  }

  onSave() {
    const loading = this.loadingCtrl.create();
    loading.then((l) => l.present());
    this.appointmentService.updateAppointmentStatus(this.appointment.appointmentId, this.appointment.status, this.cancelReason).subscribe((response) => {
      loading.then((l) => l.dismiss());
      if (response && response.status === 'SUCCESS') {
        this.toast.showToast('Successfully updated the appointment');
        this.sharedService.changeAppointmentMannualRefresh(1);
        this.sharedService.changeNewappointmentListReferesh(1);
        this.sharedService.changeUpcomingAppointmentListReferesh(1);
        this.sharedService.changeWalkinAppointmentReferesh(1);
        this.previous();
      }
      else {
        this.toast.showToast('Something went wrong. Please try again');
      }
    });
  }
  previous() {
    this.nav.GoBackTo('/home/tabs/tab1');
  }
  addAnotherService(id) {
    this.nav.GoForward('/addanotherservice/' + id);
  }
}
