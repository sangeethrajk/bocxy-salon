import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorhandlerService } from '../_services/errorhandler.service';
import { environment } from '../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class DashboardService {
  constructor(private http: HttpClient, private eh: ErrorhandlerService) { }

  getAllServices(serviceGroupId) {
    let url = '';
    if (serviceGroupId) {
      url = `?serviceGroupId=${serviceGroupId}`;
    }
    return this.http.get<{ data: any, status: string }>(`${environment.apiUrl}servicesList${url}`).
      pipe(tap(_ => console.log('Get services list')),
        catchError(this.eh.handleHttpError<{ data: any, status: string }>('Services list', { data: {}, status: 'FAILURE' })));
  }

  getServiceGenderCategoriesList() {
    return this.http.get<{ data: any, status: string }>(`${environment.apiUrl}genderCategoriesList`).
      pipe(tap(_ => console.log('Get gender category list')),
        catchError(this.eh.handleHttpError<{ data: any, status: string }>('Gender category list', { data: {}, status: 'FAILURE' })));
  }

  getServiceGroup() {
    return this.http.get<{ data: any, status: string }>(`${environment.apiUrl}serviceGroupList`).
      pipe(tap(_ => console.log('Get service group list')),
        catchError(this.eh.handleHttpError<{ data: any, status: string }>('service group list', { data: {}, status: 'FAILURE' })));
  }
}
