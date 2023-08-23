import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorhandlerService } from '../_services/errorhandler.service';
import { MerchantStore } from './findstore.model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()

export class FindStoreService {
  constructor(private http: HttpClient, private eh: ErrorhandlerService) {

  }

  getMerchantStoreList(): Observable<{ data: MerchantStore[], status: string }> {
    return this.http.get<{ data: MerchantStore[], status: string }>(`${environment.apiUrl}merchantStoresList`).pipe(
      tap(_ => console.log('Merchant store list fetch')),
      catchError(this.eh.handleHttpError<{ data: MerchantStore[], status: string }>('Failed to fetch merchant store list'))
    );
  }
}
