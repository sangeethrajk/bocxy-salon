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

export class UpdatePasswordService {

  constructor(private http: HttpClient, private eh: ErrorhandlerService) { }

  updatePassword(postData) {
    return this.http.post<{ data: boolean; status: string }>(`${environment.apiUrl}accountPasswordUpdate`, postData, httpOptions)
      .pipe(
        tap(_ => console.log('password Update ', _)),
        catchError(this.eh.handleHttpError<{ data: boolean; status: string }>('password Update'))
      );
  }
}
