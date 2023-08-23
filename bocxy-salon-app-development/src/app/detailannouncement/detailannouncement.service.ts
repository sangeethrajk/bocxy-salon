import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorhandlerService } from '../_services/errorhandler.service';
import { detailAnnoucementCustomer } from './detailannoucement.model';

@Injectable({
  providedIn: 'root'
})

export class detailAnnoucementService {

  constructor(
    private http: HttpClient,
    private eh: ErrorhandlerService
  ) { }
  getAnnoucementDetails(id: number): Observable<{ data: detailAnnoucementCustomer, status: string }> {
    return this.http.get<{ data: detailAnnoucementCustomer, status: string }>(`${environment.apiUrl}getAnnoucement/${id}`)
      .pipe(
        tap(_ => console.log('Fetched annoucement Service', _)),
        catchError(this.eh.handleHttpError<{ data: detailAnnoucementCustomer, status: string }>('annoucement'))
      );
  }



}