import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorhandlerService } from '../_services/errorhandler.service';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable()

export class CustomerInfoService {

    constructor(private http: HttpClient, private eh: ErrorhandlerService) { }

    registerProfile(postData) {
        return this.http.post<{ data: boolean; status: string }>(`${environment.apiUrl}registerProfile`, postData, httpOptions)
            .pipe(
                tap(_ => console.log('registerProfile', _)),
                catchError(this.eh.handleHttpError<{ data: boolean; status: string }>('registerProfile'))
            );
    }

}
