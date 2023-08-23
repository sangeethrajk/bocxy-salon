import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { SlotInputTime } from './createInputTime.model';
import { SlotGroup } from '../_models/slotGroup.model';
import { MerchantSlot } from './regularMerchantSlot.model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class SlotTimeCreateService {
  constructor(private http: HttpClient, private eh: ErrorHandler) { }

  CheckSlotStartDate(startDate: string) {
    return this.http.get<{ data: number; status: string }>(`${environment.apiUrl}checkSlotsStartDate?startDate=${startDate}`, httpOptions)
      .pipe(tap(_ => console.log('Slot start date check')),
        catchError(this.eh.handleHttpError<{ data: number; status: string }>('Slot start date failed')));
  }

  UpdateSlot(slot: any, url: string) {
    return this.http.post<{ data: any, status: string }>(`${environment.apiUrl}${url}`, slot, httpOptions)
      .pipe(tap(_ => console.log('Slot updated'),
        catchError(this.eh.handleHttpError<{ data: any; status: string }>('Slot update failed'))));
  }
}
