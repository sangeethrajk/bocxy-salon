import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

// import { Account } from '../models/account.model';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { Stylist } from './stylistmgmt.model';

const httpOptions = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
  })
};
@Injectable()
export class StylistManagementService {

  constructor(
    private http: HttpClient,
    private eh: ErrorHandler
  ) { }

  getStylists(): Observable<{ data: Stylist[], status: string }> {
    return this.http.get<{ data: Stylist[], status: string }>(`${environment.apiUrl}professionist`)
      .pipe(
        tap(_ => console.log('Fetched Merchant Stylist', _)),
        catchError(this.eh.handleHttpError<{ data: Stylist[], status: string }>('getMerchantStylist'))
      );
  }
  // removeStylist(id: number) {
  //   return this.http.delete<{ data: string, status: string }>(`${environment.apiUrl}professionist/${id}`)
  //     .pipe(
  //       tap(_ => console.log('Remove Merchant Stylist: ', _)),
  //       catchError(this.eh.handleHttpError<{ data: string, status: string }>('Remove Merchant Stylist'))
  //     );
  // }
  removeStylist(id:number):Observable<{data:any, status:string}>{
    return this.http.delete<{data:any, status:string}>(`${environment.apiUrl}professionist/${id}`, httpOptions).
    pipe(tap(_=>console.log('Remove Merchant Stylist: ')),
    catchError(this.eh.handleHttpError<{data:any, status:string}>('Remove Merchant Stylist')));
}
}
