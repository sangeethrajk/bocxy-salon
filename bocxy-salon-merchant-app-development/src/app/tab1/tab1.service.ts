import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandler } from '../_services/error-handler.service';
import { environment } from '../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Stylist } from './tab1.model';
import { Observable, of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class DashboardService {
  constructor(private http: HttpClient, private eh: ErrorHandler) { }

  getAppointmentCount() {
    return this.http.get<{ data: any, status: string }>(`${environment.apiUrl}merchantDashboardAppointments`).
      pipe(tap(_ => console.log("Get Appointment counts")),
        catchError(this.eh.handleHttpError<{ data: any, status: string }>('Appointment count', { data: {}, status: "FAILURE" })));
  }

  getProfessionalList(): Observable<{ data: Stylist[]; status: string }> {
    return this.http
      .get<{ data: Stylist[]; status: string }>(
        `${environment.apiUrl}stylistList`)
      .pipe(
        tap(_ => console.log('Fetched List')),
        catchError(this.eh.handleHttpError<{ data: Stylist[], status: string }>('List not fetched'))
      );
  }

  getOngoingAppointment(stylistId, page): Observable<{ data: any, status: string, perPage: number, totalCount: number, totalPages: number }> {
    const url = stylistId === null || stylistId === 0 ? '' : `&professionistId=${stylistId}`;
    return this.http.get<{ data: any, status: string, perPage: number, totalCount: number, totalPages: number }>(`${environment.apiUrl}merchantOngoingAppointments?pagination=true&page=${page}&status=CONFIRMED,CHECKIN${url}`).pipe(
      tap(),
      catchError(this.eh.handleHttpError<{ data: any, status: string, perPage: number, totalCount: number, totalPages: number }>('Stylist not found'))
    );
  }
}