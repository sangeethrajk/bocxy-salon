import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { ErrorHandler } from './error-handler.service';
import { environment } from '../../environments/environment';
import { StoreTypesList } from '../_models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient,
    private eh: ErrorHandler
  ) { }
  checkExists(values): Observable<{ data: boolean; status: string }> {
    return this.http
      .get<{ data: boolean; status: string }>(
        `${environment.apiUrl}checkAccountExist?mobileNo=${values.mobileNo}&dialCode=${encodeURIComponent(values.dialCode)}`
      )
      .pipe(
        tap((_) => console.log(`email exist ${values}`, _)),
        catchError(this.eh.handleHttpError<{ data: boolean, status: string }>('Email Exist Check'))
      );
  }
  checkProfessionistExists(values): Observable<{ data: boolean; status: string }> {
    return this.http
      .get<{ data: boolean; status: string }>(
        `${environment.apiUrl}checkProfessionistAccountExist?mobileNo=${values.mobileNo}&dialCode=${encodeURIComponent(values.dialCode)}`
      )
      .pipe(
        tap((_) => console.log(`email exist ${values}`, _)),
        catchError(this.eh.handleHttpError<{ data: boolean, status: string }>('Email Exist Check'))
      );
  }
  getStoreTypesList(): Observable<{ data: StoreTypesList[]; status: string }> {
    return this.http
      .get<{ data: StoreTypesList[]; status: string }>(
        `${environment.apiUrl}storeTypesList`
      )
      .pipe(
        tap((_) => console.log(`Fetched StoreTypesList`, _)),
        catchError(this.eh.handleHttpError<{ data: StoreTypesList[], status: string }>('getStoreTypesList'))
      );
  }
}
