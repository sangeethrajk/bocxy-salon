import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CancelledAppointment } from './cancelled.model';
import { CancelledService } from './cancelled.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { ToastService } from '../_services/toast.service';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { DateService } from '../_services/date.service';
@Component({
  selector: 'app-cancelled',
  templateUrl: './cancelled.page.html',
  styleUrls: ['./cancelled.page.scss'],
})
export class CancelledPage implements OnInit {

  constructor(
    private _location: Location,
    private cancelService: CancelledService,
    public alertController: AlertController,
    private loadingCtrl: LoadingController,
    private dateService: DateService,
    private toast: ToastService,
    private nh: NavigationHandler
  ) { }

  dateFilter: string;
  appointments: CancelledAppointment[];
  cancelledDate: string;
  maxFilterDate: string;
  minFilterDate: string;
  page: number;
  totalPages: number;
  totalAppointmentCount: number;
  selectedAppointmentDate: string;

  ngOnInit() {
    this.appointments = [];
    this.page = 1;
    this.getCancelledAppointments(null);
    this.setMaxFilterDate();
  }

  previous() {
    this.nh.GoBackTo('/home/tabs/tab1');
  }

  setMaxFilterDate() {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    this.maxFilterDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
  }

  async getCancelledAppointments(date: Date) {
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    const currentDate = new Date();
    // this.cancelledDate = date != null ? (currentDate.toLocaleDateString() === date.toLocaleDateString() ? 'Current' : date.toLocaleDateString()) : "Current";
    this.cancelledDate = date != null ? (currentDate.toLocaleDateString() === date.toLocaleDateString() ? 'Today' : date.toLocaleDateString()) : "All";
    this.selectedAppointmentDate = date != null ? `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}` : null;
    //  this.selectedAppointmentDate = date != null ? `${date.getFullYear()}-${("0"+(date.getMonth()+1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}` : null;

    await this.cancelService.getCancelledAppointments(this.page, this.selectedAppointmentDate).subscribe(
      (response) => {
        loading.then(l => l.dismiss());
        if (response && response.status === 'SUCCESS') {
          this.totalPages = response.totalPages;
          this.totalAppointmentCount = response.totalCount;
          for (const item of response.data) {
            const length = item.canceledServices.length;
            let serviceList = '';
            for (let i = 0; i < length; i++) {
              serviceList += item.canceledServices[i].name;
              if (i != length - 1) {
                serviceList += ', ';
              }

              item.cancelledServiceList = serviceList;
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
    // alert(currentDateTime);
    const diff = (currentDateTime.getTime() - bookedDateTime.getTime());
    // alert(diff);
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


  filterChange(date) {
    this.page = 1;
    this.totalPages = 0;
    this.totalAppointmentCount = 0;
    this.appointments = [];
    this.getCancelledAppointments(new Date(date));
  }

  doRefresh(refresher) {
    const date = this.cancelledDate === 'All' ? null : new Date(this.selectedAppointmentDate);
    this.page = 1;
    this.totalPages = 0;
    this.totalAppointmentCount = 0;
    this.appointments = [];
    this.getCancelledAppointments(date).then(data => { refresher.target.complete(); })
      .catch(err => {
        refresher.target.complete();
      });;
  }

  loadMoreData(infiniteScroll) {
    this.page = this.page + 1;
    const date = this.cancelledDate === 'All' ? null : new Date(this.selectedAppointmentDate);
    console.log(this.cancelledDate);
    this.getCancelledAppointments(date).then(data => {
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
    return this.dateService.timeConvert(time)
  }
}
