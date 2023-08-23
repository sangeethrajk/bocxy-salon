import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonSlides,
  Platform,
  MenuController,
  IonRouterOutlet,
  LoadingController
} from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Location, DatePipe } from '@angular/common';
import { HardBackService } from '../_services/hardback.service';
import { PermissionService } from '../_services/permission.service';
import { DashboardService } from './tab1.service';
import { ToastService } from '../_services/toast.service';
import { SharedService } from '../_services/shared.service';
import { merchantNotificationService } from '../notifications/notfications.service';
import { take, takeUntil } from 'rxjs/operators';
import { Time } from '../_models/Time.model';
import { OnGoingAppointment } from './tab1.model';
import { Stylist } from './tab1.model';
import { NavigationHandler } from '../_services/navigation-handler.service';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  @ViewChild('homeSlider') slides: IonSlides;
  // subscribe: any;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoplay: true,
  };

  homeslides = [
    './assets/img/h-slide-1.jpg',
    './assets/img/h-slide-2.jpg',
    './assets/img/h-slide-3.jpg',
    './assets/img/h-slide-4.jpg',
  ];
  services = [
    { name: 'For Men', img: './assets/icon/man.svg' },
    { name: 'For Women', img: './assets/icon/woman.svg' },
    { name: 'For Kids', img: './assets/icon/boy.svg' },
    { name: 'Massage', img: './assets/icon/massage.svg' },
    { name: 'Makeup', img: './assets/icon/makeup.svg' },
    { name: 'Haircut', img: './assets/icon/haircut.svg' },
    { name: 'Skin', img: './assets/icon/skin.svg' },
    { name: 'Facial', img: './assets/icon/facial.svg' },
    { name: 'Hair', img: './assets/icon/haircare.svg' },
    { name: 'Nails', img: './assets/icon/nail.svg' },
    { name: 'Bride', img: './assets/icon/bride.svg' },
    { name: 'Groom', img: './assets/icon/groom.svg' },
  ];

  upcoming = [
    { timestamp: '08.00 am', dates: 'Oct 29', servicename: 'Facial Bleach', color: 'success' },
    { timestamp: '08.30 am', dates: 'Oct 29', servicename: 'Gold Facial', color: 'warning' },
    { timestamp: '09.00 am', dates: 'Oct 29', servicename: 'Hair straightening', color: 'warning' },
    { timestamp: '09.30 am', dates: 'Oct 29', servicename: 'Face Mask', color: 'warning' },
    { timestamp: '08.00 am', dates: 'Oct 29', servicename: 'Facial Bleach', color: 'success' },
    { timestamp: '08.30 am', dates: 'Oct 29', servicename: 'Gold Facial', color: 'warning' },
    { timestamp: '09.00 am', dates: 'Oct 29', servicename: 'Hair straightening', color: 'warning' },
    { timestamp: '09.30 am', dates: 'Oct 29', servicename: 'Face Mask', color: 'warning' }
  ];

  showRevenue = true;

  newAppointmentCount: number;
  upComingAppoinmentCount: number;
  walkinAppoinmentCount: number;
  cancelledAppointmentCount: number;
  totalNotficationsCount: number;
  onGoingAppointmentTotalPage: number;
  onGoingPage: number;
  onGoingAppointmentTotalCount: number;
  stylistList: Stylist[];
  selectedStylist: number;
  refreshSubscription = new Subject();

  constructor(
    private statusBar: StatusBar,
    private _location: Location,
    public menuCtrl: MenuController,
    public platform: Platform,
    private routerOutlet: IonRouterOutlet,
    private hardBackService: HardBackService,
    private permissionService: PermissionService,
    private dashboardService: DashboardService,
    private Cservice: merchantNotificationService,
    private loadingCtrl: LoadingController,
    private toast: ToastService,
    private sharedService: SharedService,
    public router: Router,
    private datePipe: DatePipe,
    private nh: NavigationHandler
  ) {

    this.permissionService.checkPermissionAccess('REVENUE_STATUS').then(
      data => {
        if (!data) {
          this.showRevenue = false;
        }
        else {
          this.showRevenue = true;
        }
      }
    );
  }

  appointments = [
    { stylist: 'Ramesh', service: 'Haircut', timestamp: 'Nov 26, 10.00 AM', color: 'success' },
    { stylist: 'Mohan', service: 'Face Mask', timestamp: 'Nov 26, 11.00 AM', color: 'light' },
    { stylist: 'Suresh', service: 'Haircut + Shaving', timestamp: 'Nov 26, 12.00 PM', color: 'light' }
  ];

  onGoingAppointments: OnGoingAppointment[] = [];

  ngOnInit() {
    this.sharedService.currentAppoinmentMannualReferesh.pipe(takeUntil(this.refreshSubscription)).subscribe(async data => {
      console.log('manual shared service');
      this.manualRefresh();
    });
  }
  ionViewDidLoad() {
    this.statusBar.backgroundColorByHexString('#ff6d79');
  }

  gotToNotifications() {
    this.nh.GoForward('/notifications');
  }

  getNotificationsCount() {
    const loading = this.loadingCtrl.create();
    loading.then((l) => l.present());
    return new Promise((resolve, reject) => {
      this.Cservice
        .getNotficationsCount()
        .pipe(take(1))
        .subscribe(
          (response) => {
            loading.then((l) => l.dismiss());
            if (response && response.status === 'SUCCESS') {
              this.totalNotficationsCount = response.data.count;
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
  getAppointmentCount() {
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    this.dashboardService.getAppointmentCount().subscribe(
      (response) => {
        loading.then(l => l.dismiss());
        if (response && response.status === 'SUCCESS') {
          this.newAppointmentCount = response.data.new;
          this.upComingAppoinmentCount = response.data.upcoming;
          this.walkinAppoinmentCount = response.data.walkin;
          this.cancelledAppointmentCount = response.data.canceled;
        }
        else {
          this.toast.showToast('Something went wrong. Please try again.');
        }
      }
    );
  }

  getOnGoingappointments() {
    const loading = this.loadingCtrl.create();
    loading.then((l) => l.present());
    this.dashboardService.getOngoingAppointment(this.selectedStylist, this.onGoingPage).subscribe((response) => {
      loading.then((l) => l.dismiss());
      if (response && response.status === 'SUCCESS') {
        const date = new Date();
        const currentTime = new Time(this.datePipe.transform(date, 'h:mm'));
        const currentDate = this.datePipe.transform(date, 'y-MM-dd');
        const upComingAppointment = [];
        this.onGoingAppointmentTotalCount = response.totalCount;
        this.onGoingAppointmentTotalPage = response.totalPages;
        for (const appointment of response.data) {
          const newAppointment = new OnGoingAppointment();
          newAppointment.appointmentId = appointment.appointmentId;
          const startTime = new Time(appointment.slotStartTime);
          const endTime = new Time(appointment.slotEndTime);
          const bookingDate = new Date(appointment.bookingDate);
          if (currentDate === appointment.bookingDate && currentTime.isGreaterOrEqual(startTime) && currentTime.isLessOrEqual(endTime)) {
            newAppointment.color = 'success';
          }
          else {
            newAppointment.color = 'light';
          }
          newAppointment.services = appointment.bookedServices[0].name;
          for (let i = 1; i < appointment.bookedServices.length; i++) {
            newAppointment.services = `${newAppointment.services},${appointment.bookedServices[i].name}`;
          }
          newAppointment.bookingDate = `${this.datePipe.transform(bookingDate, 'MMM d')},  ${startTime.toShortTime()}`;
          newAppointment.stylistName = appointment.stylistName;
          newAppointment.slotStartTime = appointment.slotStartTime;
          newAppointment.slotEndTime = appointment.slotEndTime;
          upComingAppointment.push(newAppointment);
        }
        if (!this.onGoingAppointments) {
          this.onGoingAppointments = [];
        }
        this.onGoingAppointments = this.onGoingAppointments.concat(upComingAppointment);
      }
      else {
        this.toast.showToast('Something went wrong. Please try again');
      }
    });


  }

  getStylistList() {
    const loading = this.loadingCtrl.create();
    loading.then((l) => l.present());
    this.dashboardService.getProfessionalList().subscribe((response) => {
      loading.then((l) => l.dismiss());
      this.stylistList = [];
      this.stylistList.push({ accountId: 0, firstName: 'All' });
      if (response && response.status === 'SUCCESS') {
        this.stylistList = this.stylistList.concat(response.data);
      }
      else {
        this.toast.showToast('Something went wrong. Please try again');
      }
    });
  }

  async manualRefresh() {
    this.onGoingPage = 1;
    this.onGoingAppointmentTotalPage = 0;
    this.onGoingAppointmentTotalCount = 0;
    this.onGoingAppointments = [];
    this.getNotificationsCount();
    this.getAppointmentCount();
    this.getStylistList();
    this.selectedStylist = 0;
    this.getOnGoingappointments();
  }

  doRefresh(refresher) {
    this.onGoingPage = 1;
    this.onGoingAppointmentTotalPage = 0;
    this.onGoingAppointmentTotalCount = 0;
    this.onGoingAppointments = [];
    this.getAppointmentCount();
    this.getStylistList();
    this.getOnGoingappointments();
    refresher.target.complete();
  }

  onStylistchange() {
    this.onGoingPage = 1;
    this.onGoingAppointmentTotalCount = 0;
    this.onGoingAppointmentTotalPage = 0;
    this.onGoingAppointments = [];
    this.getOnGoingappointments();
  }

  loadMoreOnGoingAppointmentData(event) {
    try {
      this.onGoingPage = this.onGoingPage + 1;
      this.getOnGoingappointments();
      event.target.complete();
      if (this.onGoingAppointments.length >= this.onGoingAppointmentTotalCount) {
        event.target.disabled = true;
      }
    }
    catch (error) {
      event.target.complete();
    }
  }
  openDetail(id: number) {
    this.nh.GoForward('/detailappointment/' + id);
  }
  checkCurrentTimeSlot(start: string, end: string) {
    if (start && end) {
      const currentDate = new Date();
      const currentDateStart = new Date(new Date().setHours(Number(start.split(':')[0]), Number(start.split(':')[1]), Number(start.split(':')[2]), 0)); // 00.00.00
      const currentDateEnd = new Date(new Date().setHours(Number(end.split(':')[0]), Number(end.split(':')[1]), Number(end.split(':')[2]), 0)); // 23.59.59
      if (currentDate >= currentDateStart && currentDate <= currentDateEnd) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  ngOnDestroy() {
    this.refreshSubscription.next();
    this.refreshSubscription.unsubscribe();
  }
}
