import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AppointmentList } from '../_models/appointmentlist.model';
import { ErrorHandler } from '../_services/error-handler.service';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()

export class AppointmentHistoryService {
  constructor(private http: HttpClient, private eh: ErrorHandler) { }

  getAppoinmentList(type: string, page: number, date: string) {
    let url = type == null ? `${environment.apiUrl}merchantAppointments?pagination=true&page=${page}&queryOrderType=PAST` : `${environment.apiUrl}/merchantAppointments?pagination=true&page=${page}&type=${type}&queryOrderType=FUTURE`;

    url = date == null ? url : `${url}&bookingDate=${date}`;
    return this.http.get<{ data: AppointmentList[], status: string, perPage: number, totalCount: number, totalPages: number }>(url, httpOptions).
      pipe(tap(_ => console.log('Fetched appointment list')),
        catchError(this.eh.handleHttpError<{ data: AppointmentList[], status: string, perPage: number, totalCount: number, totalPages: number }>('', { data: [], status: 'Failed', perPage: 0, totalCount: 0, totalPages: 0 })));
  }

}
