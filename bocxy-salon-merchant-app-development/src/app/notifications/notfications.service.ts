import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { MerchantNotifications } from './notifications.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()

export class merchantNotificationService {
  constructor(private http: HttpClient, private eh: ErrorHandler) {

  }
  getNotficationsCount():
    Observable<{ data: { count: number }, perPage: number, totalPages: number, totalCount: number, status: string }> {
    return this.http.get<{ data: { count: number }, perPage: number, totalPages: number, totalCount: number, status: string }>(
      `${environment.apiUrl}merchantNotificationCount`, httpOptions
    ).pipe(
      tap(_ => console.log('Success - Grade list fetch'),
        catchError(this.eh.handleHttpError('Error - Grade list fetch'))));
  }
  getNotfications(page: number):
    Observable<{ data: MerchantNotifications[], perPage: number, totalPages: number, totalCount: number, status: string }> {
    return this.http.get<{ data: MerchantNotifications[], perPage: number, totalPages: number, totalCount: number, status: string }>(
      `${environment.apiUrl}merchantNotifications`, httpOptions
    ).pipe(
      tap(_ => console.log('Success - Grade list fetch'),
        catchError(this.eh.handleHttpError('Error - Grade list fetch'))));
  }
  updateNotficationsFlag(notificationId: number) {
    return this.http.put<{ data, status: string }>(`${environment.apiUrl}merchantNotifications/${notificationId}`, httpOptions)
      .pipe(
        tap(_ => console.log('update merchantNotifications', _)),
        catchError(this.eh.handleHttpError<{ data, status: string }>('merchantNotifications not updated'))
      );
  }
}
