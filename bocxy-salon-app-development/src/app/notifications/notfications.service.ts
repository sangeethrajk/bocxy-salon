import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorhandlerService } from '../_services/errorhandler.service';
import { CustomerNotifications } from './notifications.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()

export class CustomerNotificationService {
  constructor(private http: HttpClient, private eh: ErrorhandlerService) {

  }
  getNotficationsCount():
    Observable<{ data: CustomerNotifications, perPage: number, totalPages: number, totalCount: number, status: string }> {
    return this.http.get<{ data: CustomerNotifications, perPage: number, totalPages: number, totalCount: number, status: string }>(
      `${environment.apiUrl}customerNotificationCount`, httpOptions
    ).pipe(
      tap(_ => console.log('Success - Grade list fetch'),
        catchError(this.eh.handleHttpError('Error - Grade list fetch'))));
  }
  getNotfications(page: number):
    Observable<{ data: CustomerNotifications[], perPage: number, totalPages: number, totalCount: number, status: string }> {
    return this.http.get<{ data: CustomerNotifications[], perPage: number, totalPages: number, totalCount: number, status: string }>(
      `${environment.apiUrl}customerNotifications?pagination=true&page=${page}`, httpOptions
    ).pipe(
      tap(_ => console.log('Success - Grade list fetch'),
        catchError(this.eh.handleHttpError('Error - Grade list fetch'))));
  }
  updateNotficationsFlag(notificationId: number) {
    return this.http.put<{ data, status: string }>(`${environment.apiUrl}customerNotifications/${notificationId}`, httpOptions)
      .pipe(
        tap(_ => console.log('update customerNotifications', _)),
        catchError(this.eh.handleHttpError<{ data, status: string }>('customerNotifications not updated'))
      );
  }
}
