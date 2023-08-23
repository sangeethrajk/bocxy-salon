import { Injectable } from '@angular/core';
import { Observable , of} from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

// import { Account } from '../models/account.model';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { MerchantCustomerService } from './tab4.model';
const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  
@Injectable()
export class MerchantCustomerServices {

  constructor(
    private http: HttpClient,
    private eh: ErrorHandler
  ) { }

 
  getVisitedCustomers(data: { page: number }) {
    return this.http.get<{ data: [MerchantCustomerService], status: string, perPage: number, totalCount: number, totalPages: number }>(`${environment.apiUrl}merchantCustomerVisited?pagination=true&page=${data.page}`)
      .pipe(
        tap(_ => console.log(`VisistedCusomers: `, _)),
        catchError(this.handleError<{ data: [MerchantCustomerService], status: string, perPage: number, totalCount: number, totalPages: number }>('get VisistedCusomers'))
      );
  }
  getRegularCustomers(data: { page: number }) {
    return this.http.get<{ data: [MerchantCustomerService], status: string, perPage: number, totalCount: number, totalPages: number }>(`${environment.apiUrl}merchantCustomerRegular?pagination=true&page=${data.page}`)
      .pipe(
        tap(_ => console.log(`RegularCusomers: `, _)),
        catchError(this.handleError<{ data: [MerchantCustomerService], status: string, perPage: number, totalCount: number, totalPages: number }>('get RegularCusomers'))
      );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
