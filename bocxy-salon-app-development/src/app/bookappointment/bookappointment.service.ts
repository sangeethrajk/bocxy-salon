import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorhandlerService } from '../_services/errorhandler.service';
import { TimeSlot, Stylist } from '../bookappointment/bookappointment.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()

export class BookAppointmentService {
  constructor(private http: HttpClient, private eh: ErrorhandlerService) {

  }

  getMerchantStoreService(id: number): Observable<{ data: any, status: string }> {
    return this.http.get<{ data: any, status: string }>(`${environment.apiUrl}merchantStoreServices/${id}`).pipe(
      tap(_ => console.log('MerchantStore service fetch')),
      catchError(this.eh.handleHttpError<{ data: any, status: string }>('Failed to fetch merchant store service'))
    );
  }

  getAppointmentDate(id: number): Observable<{ data: string[], status: string }> {
    return this.http.get<{ data: string[], status: string }>(`${environment.apiUrl}appointmentDates/${id}`, httpOptions).
      pipe(
        tap(_ => console.log('appointment dates')),
        catchError(this.eh.handleHttpError<{ data: string[], status: string }>('Appointment dates', { data: [], status: 'Failure' }))
      );
  }

  getDateSlots(date: string, id: number): Observable<{ data: any, status: string }> {
    return this.http.get<{ data: any, status: string }>(`${environment.apiUrl}appointmentSlots/${id}/${date}`, httpOptions).
      pipe(
        tap(_ => console.log('Appoinment date slot')),
        catchError(this.eh.handleHttpError<{ data: any, status: string }>('Appoinment date slot', { data: [], status: 'Failure' }))
      );
  }

  getStylist(id: number): Observable<{ data: any, status: string }> {
    return this.http.get<{ data: Stylist[], status: string }>(`${environment.apiUrl}stylistByService/${id}`).
      pipe(tap(_ => console.log('Stylist list')),
        catchError(this.eh.handleHttpError<{ data: any, status: string }>('Failed to get stylist list')));
  }

  getStylistSlots(serviceId: number, stylistId: number, date: string): Observable<{ data: any, status: string }> {
    return this.http.get<{ data: any, status: string }>(`${environment.apiUrl}appointmentStylistSlots/${serviceId}/${stylistId}/${date}`).
      pipe(tap(_ => console.log('Fetched stylist slots')),
        catchError(this.eh.handleHttpError<{ data: any, status: string }>('Failed to fetch stylist slot')));

  }

}
