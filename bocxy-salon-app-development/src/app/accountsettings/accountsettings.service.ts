import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AccountSettingsCustomer } from './accountSettings.model';
import { ErrorhandlerService } from '../_services/errorhandler.service';

@Injectable({
    providedIn: 'root'
})
export class AccountSettingsService {

    constructor(
        private http: HttpClient,
        private eh: ErrorhandlerService
    ) { }

    getCurrentUserAccountForCustomer(): Observable<{ data: AccountSettingsCustomer; status: string }> {
        return this.http
            .get<{ data: AccountSettingsCustomer; status: string }>(
                `${environment.apiUrl}currentUserAccountDetails`)
            .pipe(
                tap(_ => console.log('Fetched Account', _)),
                catchError(this.eh.handleHttpError<{ data: AccountSettingsCustomer, status: string }>('Email Exist Check'))
            );
    }

    profileUpdate(profileObject: any): Observable<{ data: any, status: string }> {
        return this.http.post<{ data: any, status: string }>(`${environment.apiUrl}profileUpdate/`, profileObject)
            .pipe(
                tap(_ => {
                    console.log('Profile Updating', _);
                }),
                catchError(this.eh.handleHttpError<{ data: any, status: string }>('Profile Update'))
            );
    }
}
