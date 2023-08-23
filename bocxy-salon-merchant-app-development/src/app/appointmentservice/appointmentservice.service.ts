import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { Observable } from 'rxjs';
import {MerchantService} from '../tab3/merchantService.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable()
export class AppointmentServiceService {

    constructor(private http:HttpClient, private eh: ErrorHandler){}  
    
    getMerchantServices():Observable<{data:MerchantService[], status:string}>{
        return this.http.get<{data:MerchantService[], status:string}>(`${environment.apiUrl}merchantServiceList`, httpOptions).
        pipe(
            tap(_=> console.log("Merchant service")),
            catchError(this.eh.handleHttpError<{data:MerchantService[], status:string}>('Merchant service',{data : [], status:"Failure"}))
            ); 
    }
  
}