import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Account } from '../_models/login.model';
import { ErrorhandlerService } from './errorhandler.service';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    public navCtrl: NavController,
    private storage: Storage,
    private eh: ErrorhandlerService
  ) { }

  login(mobileNo: number, dialCode: string, password: string): Observable<{ data: any, status: string }> {
    return this.http.post<{ data: any, status: string }>(`${environment.apiUrl}login/`, {
      type: 'USER',
      mobileNo,
      dialCode,
      password
    }, httpOptions)
      .pipe(
        tap(_ => {
          console.log('Authenticating', _);
        }),
        catchError(this.eh.handleHttpError<{ data: any, status: string }>('Login Authenticate'))
      );
  }

  getAccount(): Observable<{ data: Account, status: string }> {
    return this.http.get<{ data: Account, status: string }>(`${environment.apiUrl}currentUserAccount`)
      .pipe(
        tap(_ => console.log('Fetched Account', _)),
        catchError(this.eh.handleHttpError<{ data: Account, status: string }>('getAccountDetails'))
      );
  }

  logout() {
    this.storage.clear();
  }
  public async isLoggedIn() {
    return await this.storage.get('accessToken') != null;
  }

  public async isLoggedOut() {
    return !(await this.isLoggedIn());
  }

}
