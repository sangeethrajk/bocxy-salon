import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { Observable } from 'rxjs';
import { StylistDetails } from '../addstylist/addstylist.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()

export class StylistProfieCompleteService {

  constructor(private http: HttpClient, private eh: ErrorHandler) { }

  registerProfile(postData) {
    return this.http.post<{
      data: boolean;
      status: string
    }>(`${environment.apiUrl}registerProfile`, postData, httpOptions)
      .pipe(
        tap(_ => console.log('registerProfile', _)),
        catchError(this.eh.handleHttpError<{ data: boolean; status: string }>('registerProfile'))
      );
  }
  getEditData(mobileNo: number, dialCode: string): Observable<{ data: StylistDetails, status: string }> {
    return this.http.get<{ data: StylistDetails, status: string }>(`${environment.apiUrl}professionistProfileComplete?mobileNo=${mobileNo}&dialCode=${encodeURIComponent(dialCode)}`)
      .pipe(
        tap(_ => console.log('Fetched stylistProfile', _)),
        catchError(this.eh.handleHttpError<{ data: StylistDetails, status: string }>('getStylistProfile'))
      );
  }

}
