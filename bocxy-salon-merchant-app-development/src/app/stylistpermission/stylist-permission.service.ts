import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { StylistPermission } from './stylistpermission.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class StylistPermissionService {

  constructor(private http: HttpClient, private eh: ErrorHandler) { }

  getPermissionList(): Observable<{ data: StylistPermission[]; status: string }> {
    return this.http
      .get<{ data: StylistPermission[]; status: string }>(
        `${environment.apiUrl}permissions`)
      .pipe(
        tap(_ => console.log('Fetched List', _)),
        catchError(this.eh.handleHttpError<{ data: StylistPermission[], status: string }>('List not fetched'))
      );
  }

  getPermissionListByProfiessionistId(professionistId: any): Observable<{ data: StylistPermission[]; status: string }> {
    return this.http
      .get<{ data: any; status: string }>(
        `${environment.apiUrl}professionistPermissions/${professionistId}`)
      .pipe(
        tap(_ => console.log('Fetched List', _)),
        catchError(this.eh.handleHttpError<{ data: any, status: string }>('List not fetched'))
      );
  }

  saveProfessionistSlots(postData: any, professionistId: any) {
    return this.http.put<{ data, status: string }>(`${environment.apiUrl}professionistPermissions/${professionistId}`, postData, httpOptions)
      .pipe(
        tap(_ => console.log('Save Permissions', _)),
        catchError(this.eh.handleHttpError<{ data, status: string }>('Permissions not saved'))
      );
  }
}
