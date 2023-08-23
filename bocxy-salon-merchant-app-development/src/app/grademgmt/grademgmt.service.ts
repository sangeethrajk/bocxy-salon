import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { StylistGrade } from '../_models/stylistgrade.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable()

export class GradeMgmtService {

    constructor(private http:HttpClient, private eh: ErrorHandler){}

    GetGrades(page:number):Observable<{data:StylistGrade[], perPage:number, totalPages:number, totalCount:number, status:string}>{
        return this.http.get<{data:StylistGrade[], perPage:number, totalPages:number, totalCount:number, status:string}>(
            `${environment.apiUrl}professionistGrades?pagination=true&page=${page}`, httpOptions
        ).pipe(
            tap(_=>console.log("Success - Grade list fetch"), 
            catchError(this.eh.handleHttpError('Error - Grade list fetch'))));
    }

    DeleteGrade(id:number):Observable<{data:any, status:string}>{
        return this.http.delete<{data:any, status:string}>(`${environment.apiUrl}professionistGrades/${id}`, httpOptions).
        pipe(tap(_=>console.log('Success - Grade delete')),
        catchError(this.eh.handleHttpError<{data:any, status:string}>('Error- grade delete')));
    }

}