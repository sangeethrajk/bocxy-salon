import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorhandlerService } from '../_services/errorhandler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
    providedIn: 'root'
})

export class ChangePasswordService {

  constructor(
    private http: HttpClient,
    private eh: ErrorhandlerService
  ) { }

  sendProfileOtp(): Observable<{ data: boolean, status: string }> {
    return this.http.post<{
      data: boolean,
      status: string
    }>(`${environment.apiUrl}profileOtp`, '', httpOptions)
      .pipe(
        tap(_ => console.log('OTP sent', _)),
        catchError(this.eh.handleHttpError<{ data: boolean, status: string }>('send OTP'))
      );
  }

  profileVerifyOtp(otp): Observable<{ data: boolean; status: string }> {
    return this.http.post<{ data: boolean; status: string }>(`${environment.apiUrl}profileVerifyOtp`, otp, httpOptions)
      .pipe(
        tap(_ => console.log('Verify OTP Authentication', _)),
        catchError(this.eh.handleHttpError<{ data: boolean; status: string }>('Verify OTP Authentication'))
      );
  }

  profilePasswordUpdate(pwdObject): Observable<{ data: boolean; status: string }> {
    return this.http.post<{ data: boolean; status: string }>(`${environment.apiUrl}profilePasswordUpdate`, pwdObject, httpOptions)
      .pipe(
        tap(_ => console.log('resend OTP Authentication', _)),
        catchError(this.eh.handleHttpError<{ data: boolean; status: string }>('resend OTP Error'))
      );
  }
}
