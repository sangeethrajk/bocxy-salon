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

export class SecurityQuestionService {

    constructor(private http: HttpClient, private eh: ErrorhandlerService) { }

    registerProfile(postData) {
        return this.http.post<{ data: boolean; status: string }>(`${environment.apiUrl}registerProfile`, postData, httpOptions)
            .pipe(
                tap(_ => console.log('registerProfile', _)),
                catchError(this.eh.handleHttpError<{ data: boolean; status: string }>('registerProfile'))
            );
    }
    getSecurityQuestion() {
        return this.http.get<{
            data: Array<{ securityQuestionId: number, question: string }>; status: string
        }>(`${environment.apiUrl}getSecurityQuestions`, httpOptions)
            .pipe(
                tap(_ => console.log('getSecurityQuestion', _)),
                catchError(this.eh.handleHttpError<{ data: Array<{ securityQuestionId: number, question: string }>; status: string }>('getSecurityQuestion'))
            );
    }

}
