import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { ProfessionList, MerchantSlot, MerchantSlotDetails } from './slogconfig.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()

export class SlotConfigService {

  constructor(private http: HttpClient, private eh: ErrorHandler) { }

  getMerchantSlotList(url: string): Observable<{ data: any[]; status: string }> {
    return this.http
      .get<{ data: MerchantSlot[]; status: string }>(
        `${environment.apiUrl}${url}`)
      .pipe(
        tap(_ => console.log('Fetched List')),
        catchError(this.eh.handleHttpError<{ data: any[], status: string }>('List not fetched'))
      );
  }

  getProfessionalList(): Observable<{ data: ProfessionList[]; status: string }> {
    return this.http
      .get<{ data: ProfessionList[]; status: string }>(
        `${environment.apiUrl}stylistList`)
      .pipe(
        tap(_ => console.log('Fetched List')),
        catchError(this.eh.handleHttpError<{ data: ProfessionList[], status: string }>('List not fetched'))
      );
  }

  getMerchantSlots(url: string): Observable<{ data: any; status: string }> {
    return this.http
      .get<{ data: MerchantSlotDetails[]; status: string }>(
        `${environment.apiUrl}${url}`)
      .pipe(
        tap(_ => console.log('Fetched slots')),
        catchError(this.eh.handleHttpError<{ data: any, status: string }>('Slots not fetched'))
      );
  }

  getProfessionistSlots(professionistAccountId: any, slotType: string, slotId: any): Observable<{ data: any; status: string }> {
    return this.http
      .get<{ data: any; status: string }>(
        `${environment.apiUrl}professionistSlots/${professionistAccountId}/${slotType}/${slotId}`)
      .pipe(
        tap(_ => console.log('Fetched slots')),
        catchError(this.eh.handleHttpError<{ data: any, status: string }>('Slots not fetched'))
      );
  }

  saveProfessionistSlots(postData) {
    return this.http.post<{ data, status: string }>(`${environment.apiUrl}professionistSlots`, postData, httpOptions)
      .pipe(
        tap(_ => console.log('Save Slots')),
        catchError(this.eh.handleHttpError<{ data, status: string }>('Slots not saved'))
      );
  }
}
