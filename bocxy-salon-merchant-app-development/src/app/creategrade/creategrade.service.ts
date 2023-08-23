import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { StylistGrade } from '../_models/stylistgrade.model';
import { Observable } from 'rxjs';
import { env } from 'process';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable()
export class GradeService {

    constructor(private http:HttpClient, private eh: ErrorHandler){}    

    addGrade(grade:string,active:string):Observable<{data:boolean, status:string}>{
        return this.http.post<{data:boolean, status:string}>(`${environment.apiUrl}professionistGrades`, {name:grade,active:active}, httpOptions).
        pipe(tap(_=>console.log("Success - Created grade")),
        catchError(this.eh.handleHttpError<{data:boolean, status:string}>('Error - Create grade')));
    }

    checkGrade(grade:string):Observable<{data:StylistGrade[], status:string}>{
        return this.http.get<{data:StylistGrade[], status:string}>(`${environment.apiUrl}professionistGrades?name=${grade}`, httpOptions).
        pipe(tap(_=>console.log("Success - Check grade")),
        catchError(this.eh.handleHttpError<{data:StylistGrade[], status:string}>('Error - Check grade')));
    }

    updateGrade(grade:StylistGrade):Observable<{data:boolean, status:string}>{        
        return this.http.put<{data:boolean, status:string}>(`${environment.apiUrl}professionistGrades/${grade.professionistGradeId}`, {name:grade.name,active:grade.active}, httpOptions).
        pipe(tap(_=>console.log('Updated grade')),
        catchError(this.eh.handleHttpError<{data:boolean, status:string}>('Error - grade update')));
    }
}