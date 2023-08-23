import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

// import { Account } from '../models/account.model';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { StylistDetails, ProfessionList, ProfessionGrade } from './addstylist.model';

@Injectable()
export class AddStylistService {

  constructor(
    private http: HttpClient,
    private eh: ErrorHandler
  ) { }

  getEditData(id: number): Observable<{ data: StylistDetails, status: string }> {
    return this.http.get<{ data: StylistDetails, status: string }>(`${environment.apiUrl}professionist/${id}`)
      .pipe(
        tap(_ => console.log('Fetched Merchant Stylist', _)),
        catchError(this.eh.handleHttpError<{ data: StylistDetails, status: string }>('getMerchantStylist'))
      );
  }
  getProfessions(): Observable<{ data: ProfessionList[], status: string }> {
    return this.http.get<{ data: ProfessionList[], status: string }>(`${environment.apiUrl}professionList`)
      .pipe(
        tap(_ => console.log('Fetched Professions', _)),
        catchError(this.eh.handleHttpError<{ data: ProfessionList[], status: string }>('getProfessions'))
      );
  }
  getProfessionsGrade(): Observable<{ data: ProfessionGrade[], status: string }> {
    return this.http.get<{ data: ProfessionGrade[], status: string }>(`${environment.apiUrl}professionistGrades?active=Y`)
      .pipe(
        tap(_ => console.log('Fetched Professions', _)),
        catchError(this.eh.handleHttpError<{ data: ProfessionGrade[], status: string }>('professionistGrades'))
      );
  }
  insertStylist(formData) {
    return this.http
      .post<{ data: number; status: string }>(
        `${environment.apiUrl}professionist`,
        formData
      )
      .pipe(
        tap((_) => console.log('Insert Merchant Stylist Response: ', _)),
        catchError(
          this.eh.handleHttpError<{ data: number; status: string }>(
            'Insert Merchant Stylist'
          )
        )
      );
  }
  updateStylist(formData, accountId) {
    return this.http
      .put<{ data: number; status: string }>(
        `${environment.apiUrl}professionist/${accountId}`,
        formData
      )
      .pipe(
        tap((_) => console.log('Update Merchant Stylist Response: ', _)),
        catchError(
          this.eh.handleHttpError<{ data: number; status: string }>(
            'Update Merchant Stylist'
          )
        )
      );
  }
  removeMerchantService(accountId: number) {
    return this.http
      .delete<{ data: string; status: string }>(`${environment.apiUrl}merchantStylist/${accountId}`)
      .pipe(
        tap((_) => console.log('delete Stylist Response: ', _)),
        catchError(
          this.eh.handleHttpError<{ data: string; status: string }>(
            'delete Stylist'
          )
        )
      );
  }

}
