import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorhandlerService } from '../_services/errorhandler.service';
import { environment } from '../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class AllServices {
  constructor(private http: HttpClient, private eh: ErrorhandlerService) { }
  /* 
      getStoreServices(queryParam: any, page?: any): Observable<{data:any, perPage:number, totalPages:number, totalCount:number, status:string}> {
          return this.http.get<{ data: any, perPage: number, totalPages: number, totalCount: number, status: string }>(`${environment.apiUrl}nearbyMerchantStoreServices${queryParam}&pagination=true&page=${page}`, httpOptions).
              pipe(tap(_ => console.log("Get services list")),
                  catchError(this.eh.handleHttpError<{ data: any, status: string }>('Services list', { data: {}, status: "FAILURE" })));
  
                 
      } */

  getStoreServices(queryParam: any, page?: any): Observable<{ data: any, perPage: number, totalPages: number, totalCount: number, status: string }> {
    return this.http.get<{ data: any, perPage: number, totalPages: number, totalCount: number, status: string }>(
      `${environment.apiUrl}nearbyMerchantStoreServices${queryParam}&pagination=true&page=${page}`, httpOptions
    ).pipe(
      tap(_ => console.log("Get services list"),
        catchError(this.eh.handleHttpError<{ data: any, status: string }>('Services list', { data: {}, status: "FAILURE" }))));
  }


  getMerchantStore(merchantStoreId: string): Observable<{ data: any, status: string }> {
    return this.http.get<{ data: any, status: string }>(
      `${environment.apiUrl}merchantStoreDetail/${merchantStoreId}`, httpOptions
    ).pipe(
      tap(_ => console.log("Get Merchant Store"),
        catchError(this.eh.handleHttpError<{ data: any, status: string }>('Get Merchant Store', { data: {}, status: "FAILURE" }))));
  }



} 