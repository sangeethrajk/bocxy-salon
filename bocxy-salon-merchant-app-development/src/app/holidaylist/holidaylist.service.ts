import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { Holiday } from './holidaylist.model';
import { Observable } from 'rxjs';
import { env } from 'process';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class HolidayListService {
  constructor(private http: HttpClient, private eh: ErrorHandler) { }

  getMerchantHolidays(page: number):
    Observable<{ data: Holiday[], perPage: number, totalPages: number, totalCount: number, status: string }> {
    return this.http.get<{ data: Holiday[], perPage: number, totalPages: number, totalCount: number, status: string }>(`${environment.apiUrl}merchantHolidays?pagination=true&page=${page}`).pipe(
      tap(_ => console.log('Merchant holidays fetched')),
      catchError(this.eh.handleHttpError<{ data: Holiday[], perPage: number, totalPages: number, totalCount: number, status: string }>('Failed to get merchant holidays'))

    );
  }

  deleteHoliday(id: number) {
    return this.http.delete<{ data: boolean, status: string }>(`${environment.apiUrl}merchantHolidays/${id}`).pipe(
      tap(_ => console.log('Deleted holiday')),
      catchError(this.eh.handleHttpError<{ data: boolean, status: string }>('Failed to delete holiday'))
    );
  }
}
