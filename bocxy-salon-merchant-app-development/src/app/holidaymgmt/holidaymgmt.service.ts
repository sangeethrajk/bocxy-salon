import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { MerchantHoliday } from './holidaymgm.model';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class HolidaymgmtService {

  constructor(private http: HttpClient, private eh: ErrorHandler) { }

  createHoliday(holiday: MerchantHoliday): Observable<{ data: boolean, status: string }> {
    return this.http.post<{ data: boolean, status: string }>(`${environment.apiUrl}merchantHolidays`, holiday).pipe(
      tap(_ => console.log('Created Holiday')),
      catchError(this.eh.handleHttpError<{ data: boolean, status: string }>('Failed to create holiday'))
    );
  }

  getMerchantHoliday(id: string): Observable<{ data: MerchantHoliday, status: string }> {
    return this.http.get<{ data: MerchantHoliday, status: string }>(`${environment.apiUrl}merchantHolidays/${id}`).pipe(
      tap(_ => console.log('Fetched Merchant holiday')),
      catchError(this.eh.handleHttpError<{ data: MerchantHoliday, status: string }>('Failed to fetch merchant holiday'))
    );
  }

  updateHoliday(holiday: MerchantHoliday): Observable<{ data: boolean, status: string }> {
    return this.http.put<{ data: boolean, status: string }>(`${environment.apiUrl}merchantHolidays/${holiday.merchantHolidayId}`,
      holiday).pipe(
        tap(_ => console.log('Created Holiday')),
        catchError(this.eh.handleHttpError<{ data: boolean, status: string }>('Failed to create holiday'))
      );
  }
}
