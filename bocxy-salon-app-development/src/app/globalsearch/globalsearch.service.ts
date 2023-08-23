import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorhandlerService } from '../_services/errorhandler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()

export class GlobalSearchService {
  constructor(private http: HttpClient, private eh: ErrorhandlerService) {

  }

  getStoreorServices(query: string): Observable<{ data: any, status: string }> {
    return this.http.get<{ data: any, status: string }>(`${environment.apiUrl}globalSearch?${query}`).pipe(
      tap(_ => console.log('Store and service fetch')),
      catchError(this.eh.handleHttpError<{ data: any, status: string }>('Failed to get store and service'))
    );
  }
}
