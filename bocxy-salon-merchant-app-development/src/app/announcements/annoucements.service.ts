import { Injectable } from '@angular/core';
import { Observable , of} from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

// import { Account } from '../models/account.model';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { annoucementsModels } from './annoucements.model';
const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  
@Injectable()
export class annoucementsServices {

  constructor(
    private http: HttpClient,
    private eh: ErrorHandler
  ) { } 

  createAnnoucements(data) {
    return this.http.post<{ data: [], status: string }>(`${environment.apiUrl}createAnnoucements`, data)
      .pipe(
        tap(_ => console.log(`createAnnoucements: `, _)),
        catchError(this.handleError<{ data: [], status: string }>('save createAnnoucements'))
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
