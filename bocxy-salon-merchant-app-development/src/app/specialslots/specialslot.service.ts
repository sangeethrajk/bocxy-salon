import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { StoreSpecialSlot } from '../storetimemgmt/StoreSlot.model';
import { analytics } from 'firebase';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class SpecialSlotService {
  constructor(private http: HttpClient, private eh: ErrorHandler) { }

  GetMerchanSpecialtSlots() {
    return this.http.get<{ data: StoreSpecialSlot[], status: string }>(`${environment.apiUrl}merchantSpecialSlots`).
      pipe(tap(_ => console.log('Merchant special slots')),
        catchError(this.eh.handleHttpError<{ data: StoreSpecialSlot[], status: string }>('Merchant special slot fetch failed',
          { data: [], status: 'Failed' })));
  }

  DeleteSpecialSlot(id: number) {
    return this.http.delete<{ data: any, status: string }>(`${environment.apiUrl}merchantSpecialSlots/${id}`).pipe(
      tap(_ => console.log('Deleted special slots')),
      catchError(this.eh.handleHttpError<{ data: any, status: string }>('Special slot delete failed'))
    );
  }
}
