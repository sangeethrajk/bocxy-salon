import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorhandlerService } from '../_services/errorhandler.service';
import { AppointmentDetails } from './paylater.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()

export class PaylaterService {
  constructor(private http: HttpClient, private eh: ErrorhandlerService) {

  }

  getAppointmentDetails(id): Observable<{ data: AppointmentDetails, status: string }> {
    return this.http.get<{ data: AppointmentDetails, status: string }>(`${environment.apiUrl}customerAppointments/${id}`).pipe(
      tap(_ => console.log('Appointment details fetch')),
      catchError(this.eh.handleHttpError<{ data: AppointmentDetails, status: string }>('Failed to fetch appointment details'))
    );
  }
}
