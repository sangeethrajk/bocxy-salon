import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { CancelledAppointment } from './cancelled.model';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable()

export class CancelledService{
    constructor(private http:HttpClient, private eh:ErrorHandler){}

    getCancelledAppointments(page:number, date:string){ 
        var url =`${environment.apiUrl}merchantCanceledAppointments?pagination=true&page=${page}&orderBy=canceledAt:desc`;    
        url = date == null ? url : `${url}&bookingDate=${date}`;
        console.log(url);
        return this.http.get<{data:CancelledAppointment[], status:string, perPage:number,totalCount:number, totalPages:number}>(url, httpOptions).     
         pipe(tap(_=>console.log("Fetched cancelled appointment list")),
            catchError(this.eh.handleHttpError<{data:CancelledAppointment[], status:string,perPage:number,totalCount:number, totalPages:number}>('',{data:[],status:'Failed', perPage:0,totalCount:0,totalPages:0})));    
    }
  
}