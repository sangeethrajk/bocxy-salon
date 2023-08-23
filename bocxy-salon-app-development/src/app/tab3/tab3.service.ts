import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorhandlerService } from '../_services/errorhandler.service';
import { Appointments } from './tab3.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()

export class BookingService {

  constructor(private http: HttpClient, private eh: ErrorhandlerService) { }

  getCustomerAppointments(): Observable<{ data: Appointments[], status: string }> {
    return this.http.get<{ data: Appointments[], status: string }>(
      `${environment.apiUrl}customerAppointments`, httpOptions
    ).pipe(
      tap(_ => console.log('Success - Appointment list fetch'),
        catchError(this.eh.handleHttpError('Error - Appointment list fetch'))));
  }
}
