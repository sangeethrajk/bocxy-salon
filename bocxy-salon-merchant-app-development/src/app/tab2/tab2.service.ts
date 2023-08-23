import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

// import { Account } from '../models/account.model';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { MerchantService, MerchantServiceGroups } from './tab2.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable()

export class ListMerchantServiceService {

  constructor(
    private http: HttpClient,
    private eh: ErrorHandler
  ) { }

  getMerchantServices(): Observable<{ data: MerchantServiceGroups[], status: string }> {
    return this.http.get<{ data: MerchantServiceGroups[], status: string }>(`${environment.apiUrl}merchantServicesGroupByService`)
      .pipe(
        tap(_ => console.log('Fetched Merchant Services', _)),
        catchError(this.eh.handleHttpError<{ data: MerchantServiceGroups[], status: string }>('getMerchantServices'))
      );
  }
  // removeMerchantService(id: number) {
  //   return this.http.delete<{ data: string, status: string }>(`${environment.apiUrl}merchantServices/${id}`)
  //     .pipe(
  //       tap(_ => console.log('Remove Merchant Service: ', _)),
  //       catchError(this.eh.handleHttpError<{ data: string, status: string }>('Remove Merchant Service'))
  //     );
  // }
  removeMerchantService(id: number): Observable<{ data: any, status: string }> {
    return this.http.delete<{ data: any, status: string }>(`${environment.apiUrl}merchantServices/${id}`, httpOptions).
      pipe(tap(_ => console.log('Success - merchantServices')),
        catchError(this.eh.handleHttpError<{ data: any, status: string }>('Error- merchantServices')));
  }

}
