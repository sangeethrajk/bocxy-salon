import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private loginCheckSource = new BehaviorSubject(null);
  currentLoginCheck = this.loginCheckSource.asObservable();

  private authTokenCheckSource = new BehaviorSubject(null);
  currentAuthTokenCheck = this.authTokenCheckSource.asObservable();

  private profileCheckSource = new BehaviorSubject(null);
  currentProfileCheck = this.profileCheckSource.asObservable();

  private serviceRefreshSource = new BehaviorSubject(null);
  currentServiceRefresh = this.serviceRefreshSource.asObservable();

  private SlotTimeManagementRefresh = new BehaviorSubject(null);
  currentSlotTimeManagementRefresh = this.SlotTimeManagementRefresh.asObservable();

  private SpecialSlotTimeManagementRefresh = new BehaviorSubject(null);
  currentSpecialSlotTimeManagementRefresh = this.SpecialSlotTimeManagementRefresh.asObservable();

  // private appoinmentRefresh = new BehaviorSubject(null);
  // currentappoinmentRefresh = this.appoinmentRefresh.asObservable();

  private styleManagmentRefresh = new BehaviorSubject(null);
  currentstyleManagmentRefresh = this.styleManagmentRefresh.asObservable();

  private gradeManagmentRefresh = new BehaviorSubject(null);
  currentgradeManagmentRefresh = this.gradeManagmentRefresh.asObservable();

  private appointmentBookingDateRefresh = new BehaviorSubject(null);
  currentAppointmentBookingDateRefresh = this.appointmentBookingDateRefresh.asObservable();

  private holidayListReferesh = new BehaviorSubject(null);
  currentholidayListReferesh = this.holidayListReferesh.asObservable();

  private appoinmentMannualReferesh = new BehaviorSubject(null);
  currentAppoinmentMannualReferesh = this.appoinmentMannualReferesh.asObservable();

  private slotHistroy = new BehaviorSubject(null);
  currentSlotHistroy = this.slotHistroy.asObservable();

  private newAppointmentListRefresh = new BehaviorSubject(null);
  currentNewAppointmentListRefresh = this.newAppointmentListRefresh.asObservable();

  private upcomingAppointmentListRefresh = new BehaviorSubject(null);
  currentUpcomingAppointmentListRefresh = this.upcomingAppointmentListRefresh.asObservable();

  private walkingAppointmentListRefresh = new BehaviorSubject(null);
  currentWalkingAppointmentListRefresh = this.walkingAppointmentListRefresh.asObservable();

  constructor(private authService: AuthService, private storage: Storage) {
    this.authService.isLoggedIn().then(x => this.loginCheckSource.next(x));
    this.storage.get('accessToken').then(x => this.authTokenCheckSource.next(x));
  }


  changeLoginCheck(message: boolean) {
    this.loginCheckSource.next(message);
  }
  changeAuthTokenCheck(message: string) {
    this.authTokenCheckSource.next(message);
  }
  changeProfileCheck(message: number) {
    this.profileCheckSource.next(message);
  }
  changeServiceRefresh(message: string) {
    this.serviceRefreshSource.next(message);
  }
  changeSlotTimeManagementRefresh(message: number) {
    this.SlotTimeManagementRefresh.next(message);
  }
  // changeAppoinmentRefresh(message: number) {
  //   this.appoinmentRefresh.next(message);
  // }
  changestyleManagmentRefresh(message: number) {
    this.styleManagmentRefresh.next(message);
  }
  changeGradeManagmentRefresh(message: number) {
    this.gradeManagmentRefresh.next(message);
  }
  changeSpecialSlotTimeManagementRefresh(message: number) {
    this.SpecialSlotTimeManagementRefresh.next(message);
  }
  changeAppointmentBookingDateRefresh(message: number) {
    this.appointmentBookingDateRefresh.next(message);
  }
  changeHolidayList(message: number) {
    this.holidayListReferesh.next(message);
  }
  changeSlotHistroy(data: any) {
    this.slotHistroy.next(data);
  }
  changeAppointmentMannualRefresh(message: number) {
    this.appoinmentMannualReferesh.next(message);
  }

  changeNewappointmentListReferesh(mesage: number) {
    this.newAppointmentListRefresh.next(mesage);
  }

  changeUpcomingAppointmentListReferesh(mesage: number) {
    this.upcomingAppointmentListRefresh.next(mesage);
  }

  changeWalkinAppointmentReferesh(message: number) {
    this.walkingAppointmentListRefresh.next(message);
  }

}
