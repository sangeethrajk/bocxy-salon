import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { ErrorHandler } from '../_services/error-handler.service';
import { environment } from '../../environments/environment';
import { AccountSettingsMerchant, AccountSettingsManager } from './accountSettings.model';

@Injectable({
  providedIn: 'root'
})
export class AccountSettingsService {

  constructor(
    private http: HttpClient,
    private eh: ErrorHandler
  ) { }

  getCurrentUserAccountForMerchant(): Observable<{ data: AccountSettingsMerchant; status: string }> {
    return this.http
      .get<{ data: AccountSettingsMerchant; status: string }>(
        `${environment.apiUrl}currentUserAccountDetails`)
      .pipe(
        tap(_ => console.log('Fetched Account', _)),
        catchError(this.eh.handleHttpError<{ data: AccountSettingsMerchant, status: string }>('Email Exist Check'))
      );
  }

  getCurrentUserAccountForManager(): Observable<{ data: AccountSettingsManager; status: string }> {
    return this.http
      .get<{ data: AccountSettingsManager; status: string }>(
        `${environment.apiUrl}currentUserAccountDetails`)
      .pipe(
        tap(_ => console.log('Fetched Account', _)),
        catchError(this.eh.handleHttpError<{ data: AccountSettingsManager, status: string }>('Email Exist Check'))
      );
  }

  profileUpdate(profileObject: any): Observable<{ data: any, status: string }> {
    return this.http.post<{ data: any, status: string }>(`${environment.apiUrl}profileUpdate/`, profileObject)
      .pipe(
        tap(_ => {
          console.log('Profile Updating', _);
        }),
        catchError(this.eh.handleHttpError<{ data: any, status: string }>('Profile Update'))
      );
  }
}
