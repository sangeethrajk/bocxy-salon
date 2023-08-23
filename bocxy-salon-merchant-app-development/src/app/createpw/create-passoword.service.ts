import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable()

export class PasswordService {

    constructor(private http: HttpClient, private eh: ErrorHandler) { }



    register(postData) {
        return this.http.post<{ data: boolean; status: string }>(`${environment.apiUrl}register`, postData, httpOptions)
            .pipe(
                tap(_ => console.log('register ', _)),
                catchError(this.eh.handleHttpError<{ data: boolean; status: string }>('register'))
            );
    }
}
