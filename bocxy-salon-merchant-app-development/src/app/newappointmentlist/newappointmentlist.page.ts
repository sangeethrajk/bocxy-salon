import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AppointmentListService } from '../_services/appointmentlist.service';
import { AppointmentList } from '../_models/appointmentlist.model';
import { AlertController, LoadingController } from '@ionic/angular';
import { ToastService } from '../_services/toast.service';
import { SharedService } from '../_services/shared.service';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

import { DateService } from '../_services/date.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-newappointmentlist',
  templateUrl: './newappointmentlist.page.html',
  styleUrls: ['./newappointmentlist.page.scss'],
})
export class NewAppointmentlistPage implements OnInit {

  constructor(
    private _location: Location,
    private appointmentService: AppointmentListService,
    public alertController: AlertController,
    private loadingCtrl: LoadingController,
    private sharedService: SharedService,
    private toast: ToastService,
    private dateService: DateService,
    private nh: NavigationHandler,
    private storage: Storage
  ) {
    this.storage.get('userData').then(x => {
      if (x) {
        this.userData = x;
      }
    });
  }

  dateFilter: string;
  appointments: AppointmentList[];
  appointmentDate: string;
  maxFilterDate: string;
  minFilterDate: string;
  page: number;
  totalPages: number;
  totalAppointmentCount: number;
  selectedAppointmentDate: string;
  refreshSubscription = new Subject();
  userData: any;

  ngOnInit() {
    this.sharedService.currentNewAppointmentListRefresh.pipe(takeUntil(this.refreshSubscription)).subscribe((data) => {
      this.appointments = [];
      this.page = 1;
      this.getAppointments(null);
      this.setMaxFilterDate();
    });
  }

  previous() {
    this.nh.GoBackTo('/home/tabs/tab1');
  }

  setMaxFilterDate() {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    this.maxFilterDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    const minDate = new Date();
    this.minFilterDate = `${minDate.getFullYear()}-${('0' + (minDate.getMonth() + 1)).slice(-2)}-${('0' + minDate.getDate()).slice(-2)}`;
  }

  async getAppointments(date: Date) {
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    const currentDate = new Date();
    this.appointmentDate = date != null ? (currentDate.toLocaleDateString() === date.toLocaleDateString() ? 'Today' : date.toLocaleDateString()) : 'Current';
    this.selectedAppointmentDate = date != null ? `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}` : null;
    await this.appointmentService.getAppoinmentList(null, this.page, this.selectedAppointmentDate, 'PENDING').subscribe(
      (response) => {
        loading.then(l => l.dismiss());
        if (response && response.status === 'SUCCESS') {
          this.totalPages = response.totalPages;
          this.totalAppointmentCount = response.totalCount;
          for (const item of response.data) {
            item.isCheckedIn = (item.status === 'CHECKIN');
            const length = item.bookedServices.length;
            let serviceList = '';
            for (let i = 0; i < length; i++) {
              serviceList += item.bookedServices[i].name;
              if (i != length - 1) {
                serviceList += ', ';
              }

              item.bookedServicesList = serviceList;
            }
          }
          this.appointments = this.appointments.concat(response.data);
        }
        else {
          this.toast.showToast('Something went wrong. Please try again');
        }
      }
    );
  }


  calculateBookingtime(createdAt: string): string {
    const arr = createdAt.split(/[- :]/);
    const bookedDateTime = new Date(Number(arr[0]), Number(arr[1]) - 1, Number(arr[2]), Number(arr[3]), Number(arr[4]), Number(arr[5]));
    const currentDateTime = new Date();
    const diff = (currentDateTime.getTime() - bookedDateTime.getTime());
    const minutes = Math.round(diff / (1000 * 60));
    const hours = Math.round(diff / (1000 * 60 * 60));
    const days = Math.round(diff / (1000 * 60 * 60 * 24));
    if (minutes <= 0) {
      return 'Just Now';
    }
    else if (minutes < 60) {
      return `${minutes} minutes ago`;
    }
    else if (hours <= 23) {
      return `${hours} hours ago`;
    }
    else {
      return `${days} days ago`;
    }
  }

  async presentAcceptAlertConfirm(appointment: AppointmentList, index: number) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Accept Appointment',
      message: 'Do you want to accept appointment?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: (no) => {
            console.log('Appointment Accept Canceled!');
          },
        },
        {
          text: 'Yes',
          cssClass: 'secondary',
          handler: async () => {
            this.updateAppointmentStatus(appointment, 'CONFIRMED', index, null);
          },
        },
      ],
    });

    await alert.present();
  }

  async presentCancelAlertConfirm(appointment: AppointmentList, index: number) {
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
            console.log('cancel Canceled!');
          },
        },
        {
          text: 'Yes',
          cssClass: 'secondary',
          handler: async (data) => {
            this.updateAppointmentStatus(appointment, 'CANCELED', index, data.Reason);
          },
        },
      ]
    });

    await alert.present();
  }


  updateAppointmentStatus(appointment: AppointmentList, status: string, index: number, reason: string) {
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    this.appointmentService.updateAppointmentStatus(appointment.appointmentId, status, reason).subscribe(
      (response) => {
        loading.then(l => l.dismiss());
        if (response && response.status == 'SUCCESS' && response.data) {
          this.appointments[index].status = status;
          this.appointments.splice(index, 1);

          this.totalAppointmentCount = this.totalAppointmentCount - 1;
          if (this.appointments.length === 0) {
            this.getAppointments(null);
          }
          if (status === 'CANCELED') {
            this.toast.showToast('Appoinment moved to cancel sections');
          } else if (status === 'CONFIRMED') {
            this.toast.showToast('Appoinment moved to upcoming sections');
          }
          this.sharedService.changeAppointmentMannualRefresh(1);
        }
        else {
          this.toast.showToast('Something went wrong. Please try again');
        }
      }
    );
  }

  filterChange(date) {
    this.page = 1;
    this.totalPages = 0;
    this.totalAppointmentCount = 0;
    this.appointments = [];
    this.getAppointments(new Date(date));
  }

  doRefresh(refresher) {
    const date = this.appointmentDate === 'Current' ? null : new Date(this.selectedAppointmentDate);
    this.page = 1;
    this.totalPages = 0;
    this.totalAppointmentCount = 0;
    this.appointments = [];
    this.getAppointments(date).then(data => { refresher.target.complete(); })
      .catch(err => {
        refresher.target.complete();
      });;
  }

  loadMoreData(infiniteScroll) {
    this.page = this.page + 1;
    const date = this.appointmentDate === 'Current' ? null : new Date(this.selectedAppointmentDate);
    this.getAppointments(date).then(data => {
      infiniteScroll.target.complete();
      if (this.appointments.length >= this.totalAppointmentCount) {
        infiniteScroll.target.disabled = true;
      }
    })
      .catch(error => { infiniteScroll.target.complete(); });
  }

  getNowUTC() {
    const now = new Date();
    // return new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
    return now;
  }
  openDetail(id: number) {
    this.nh.GoForward('/detailappointment/' + id);
  }
  getAMPM(time) {
    return this.dateService.timeConvert(time);
  }

  ngOnDestroy() {
    this.refreshSubscription.next();
    this.refreshSubscription.unsubscribe();
  }
}
