import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

// import { Account } from '../models/account.model';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { MerchantServiceDetails } from '../addservices/addservices.model';


@Injectable()
export class StoreDefaultSlotsServices {

  constructor(
    private http: HttpClient,
    private eh: ErrorHandler
  ) { }


  getStoreDefaultSlots(): Observable<{ data: MerchantServiceDetails, status: string }> {
    return this.http.get<{ data: MerchantServiceDetails, status: string }>(`${environment.apiUrl}storeDefaultSlot`)
      .pipe(
        tap(_ => console.log('Fetched storeDefaultSlot', _)),
        catchError(this.eh.handleHttpError<{ data: MerchantServiceDetails, status: string }>('storeDefaultSlot'))
      );
  }

  createStoreDefaultSlots(formData) {
    return this.http
      .post<{ data: number; status: string }>(
        `${environment.apiUrl}storeDefaultSlot`,
        formData
      )
      .pipe(
        tap((_) => console.log('Insert storeDefaultSlot Service Response: ', _)),
        catchError(
          this.eh.handleHttpError<{ data: number; status: string }>(
            'Insert storeDefaultSlot Service'
          )
        )
      );
  }




}
