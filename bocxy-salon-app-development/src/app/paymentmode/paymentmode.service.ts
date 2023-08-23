import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorhandlerService } from '../_services/errorhandler.service';
import { AppointmentBookingResponse } from './paymentmode.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()

export class PaymentModeService {
  constructor(private http: HttpClient, private eh: ErrorhandlerService) {

  }

  createAppointment(data: any): Observable<{ data: AppointmentBookingResponse, status: string }> {
    return this.http.post<{ data: AppointmentBookingResponse, status: string }>(`${environment.apiUrl}appointment`, data, httpOptions).pipe(
      tap(_ => console.log('Created appointment')),
      catchError(this.eh.handleHttpError<{ data: AppointmentBookingResponse, status: string }>('Failed to create appointment'))
    );
  }

}
