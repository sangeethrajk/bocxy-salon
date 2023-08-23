import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorhandlerService } from '../_services/errorhandler.service';
import { AccountSecurityQuestions } from './forgotpw.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()

export class ForgotPasswordService {

  constructor(
    private http: HttpClient,
    private eh: ErrorhandlerService
  ) { }

  sendOtp(obj): Observable<{ data: boolean, status: string }> {
    return this.http.post<{
      data: boolean,
      status: string
    }>(`${environment.apiUrl}forgotPassword`, {
      mobileNo: obj.mobileNumber,
      dialCode: obj.dialCode
    }, httpOptions)
      .pipe(
        tap(_ => console.log('OTP sent', _)),
        catchError(this.eh.handleHttpError<{ data: boolean, status: string }>('send OTP'))
      );
  }

  verifyOtp(postData): Observable<{ data: boolean; status: string }> {
    return this.http.post<{ data: boolean; status: string }>(`${environment.apiUrl}verifyOtp`, postData, httpOptions)
      .pipe(
        tap(_ => console.log('Verify OTP Authentication', _)),
        catchError(this.eh.handleHttpError<{ data: boolean; status: string }>('Verify OTP Authentication'))
      );
  }
  otpresend(postData): Observable<{ data: boolean; status: string }> {
    return this.http.post<{ data: boolean; status: string }>(`${environment.apiUrl}resendOtp`, postData, httpOptions)
      .pipe(
        tap(_ => console.log('resend OTP Authentication', _)),
        catchError(this.eh.handleHttpError<{ data: boolean; status: string }>('resend OTP Error'))
      );
  }
  getAccountSecurityQuestions(getData): Observable<{ data: AccountSecurityQuestions[]; status: string }> {
    return this.http.get<{
      data: AccountSecurityQuestions[],
      status: string
      // tslint:disable-next-line: max-line-length
    }>(`${environment.apiUrl}getAccountSecurityQuestions?mobileNo=${getData.mobileNumber}&dialCode=${encodeURIComponent(getData.dialCode)}`, httpOptions)
      .pipe(
        tap(_ => console.log('Verify OTP Authentication', _)),
        catchError(this.eh.handleHttpError<{ data: AccountSecurityQuestions[]; status: string }>('Verify OTP Authentication'))
      );
  }
  validateSecurityQuestion(postData): Observable<{ data: boolean; status: string }> {
    return this.http.post<{ data: boolean; status: string }>(`${environment.apiUrl}checkAccountSecurityQuestion`, postData, httpOptions)
      .pipe(
        tap(_ => console.log('Verify OTP Authentication', _)),
        catchError(this.eh.handleHttpError<{ data: boolean; status: string }>('Verify OTP Authentication'))
      );
  }
}
