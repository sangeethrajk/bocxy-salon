import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { ErrorhandlerService } from './errorhandler.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient,
    private eh: ErrorhandlerService
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
}
