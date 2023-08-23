import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandler } from './error-handler.service';
import { AppointmentList } from '../_models/appointmentlist.model';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()

export class AppointmentListService {

  constructor(private http: HttpClient, private eh: ErrorHandler) { }

  getAppoinmentList(type: string, page: number, date: string, appointmentStatus: string) {
    var url = type == null ? `${environment.apiUrl}merchantAppointments?pagination=true&page=${page}&queryOrderType=FUTURE&status=${appointmentStatus}` : `${environment.apiUrl}merchantAppointments?pagination=true&page=${page}&type=${type}&queryOrderType=FUTURE&status=${appointmentStatus}`;
    url = date == null ? url : `${url}&bookingDate=${date}`;
    console.log(url);
    return this.http.get<{ data: AppointmentList[], status: string, perPage: number, totalCount: number, totalPages: number }>(url, httpOptions).
      pipe(tap(_ => console.log("Fetched appointment list")),
        catchError(this.eh.handleHttpError<{ data: AppointmentList[], status: string, perPage: number, totalCount: number, totalPages: number }>('', { data: [], status: 'Failed', perPage: 0, totalCount: 0, totalPages: 0 })));
  }

  updateAppointmentStatus(id: number, appointmentStatus: string, reason: string) {
    var data = reason == null ? { appointmentId: id, status: appointmentStatus } : { appointmentId: id, status: appointmentStatus, cancelReason: reason }
    return this.http.post<{ data: boolean, status: string }>(`${environment.apiUrl}appointmentStatus`, data, httpOptions).
      pipe(tap(_ => console.log("Appointment status updated")),
        catchError(this.eh.handleHttpError<{ data: boolean, status: string }>('', { data: false, status: 'Failed' })));
  }
}