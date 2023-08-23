import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { SlotInputTime } from './slotInputTime.model';
import { SlotGroup } from '../_models/slotGroup.model';
import { MerchantSpecialSlot } from './storeMerchantSlot.model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class SlotTimeCreateService {
  constructor(private http: HttpClient, private eh: ErrorHandler) { }

  GetMerchantSlot(slotId: number, url: string): Observable<{ data: SlotInputTime, status: string }> {
    return this.http.get<{ data: SlotInputTime, status: string }>(`${environment.apiUrl}${url}/${slotId}`, httpOptions).
      pipe(tap(_ => console.log('Merchant slot fetch')),
        catchError(this.eh.handleHttpError<{ data: SlotInputTime; status: string }>('merchantSlots')));
  }

  GetSlotGroupList() {
    return this.http.get<{ data: SlotGroup[]; status: string }>(`${environment.apiUrl}slotGroupList`, httpOptions)
      .pipe(tap(_ => console.log('Slot group list fetch')),
        catchError(this.eh.handleHttpError<{ data: SlotGroup[]; status: string }>('slotGroupList')));
  }

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

  PutSpecialSlot(slot: MerchantSpecialSlot, id: number) {
    return this.http.put<{ data: any, status: string }>(`${environment.apiUrl}merchantSpecialSlots/${id}`, slot, httpOptions)
      .pipe(tap(_ => console.log('Special Slot updated'),
        catchError(this.eh.handleHttpError<{ data: any; status: string }>('Special Slot update failed'))));
  }

  CheckSpecialSlotDate(startDate: string, endDate: string) {
    return this.http.get<{ data: number; status: string }>(`${environment.apiUrl}checkSpecialSlotsByDate?startDate=${startDate}&endDate=${endDate}`, httpOptions)
      .pipe(tap(_ => console.log('Special Slot start date check')),
        catchError(this.eh.handleHttpError<{ data: number; status: string }>('Special Slot start date failed')));
  }
  checkRegularSlotName(values): Observable<{ data: boolean; status: string }> {
    return this.http
      .get<{ data: boolean; status: string }>(
        `${environment.apiUrl}checkSlotExist?name=${values}`
      )
      .pipe(
        tap((_) => console.log(`Slot Name Check ${values}`, _)),
        catchError(this.eh.handleHttpError<{ data: boolean, status: string }>('Slot Name Check'))
      );
  }
  checkRegularSplSlotName(values): Observable<{ data: boolean; status: string }> {
    return this.http
      .get<{ data: boolean; status: string }>(
        `${environment.apiUrl}checkSplSlotExist?name=${values}`
      )
      .pipe(
        tap((_) => console.log(`Slot Name Check ${values}`, _)),
        catchError(this.eh.handleHttpError<{ data: boolean, status: string }>('Slot Name Check'))
      );
  }
}
