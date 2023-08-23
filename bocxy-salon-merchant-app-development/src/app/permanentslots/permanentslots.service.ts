import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { StoreSlot } from '../storetimemgmt/StoreSlot.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class PermanentSlotService {
  constructor(private http: HttpClient, private eh: ErrorHandler) { }

  GetMerchantSlots() {
    return this.http.get<{ data: StoreSlot[], status: string }>(`${environment.apiUrl}merchantSlots`).
      pipe(tap(_ => console.log('Merchant slots')),
        catchError(this.eh.handleHttpError<{ data: StoreSlot[], status: string }>('Merchant slot fetch failed', { data: [], status: 'Failed' })));
  }
}
