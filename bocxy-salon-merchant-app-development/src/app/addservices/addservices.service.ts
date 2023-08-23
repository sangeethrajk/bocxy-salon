import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

// import { Account } from '../models/account.model';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { MerchantServiceDetails, ServiceList, ServiceCategoryList, ServiceGenderCategory, serviceGroupList } from './addservices.model';
import { StylistGrade } from '../_models/stylistgrade.model';

@Injectable()
export class AddServiceService {

  constructor(
    private http: HttpClient,
    private eh: ErrorHandler
  ) { }

  getEditData(id: number): Observable<{ data: MerchantServiceDetails, status: string }> {
    return this.http.get<{ data: MerchantServiceDetails, status: string }>(`${environment.apiUrl}merchantServices/${id}`)
      .pipe(
        tap(_ => console.log('Fetched Merchant Service', _)),
        catchError(this.eh.handleHttpError<{ data: MerchantServiceDetails, status: string }>('getMerchantService'))
      );
  }
  getServices(id): Observable<{ data: ServiceList[], status: string }> {
    return this.http.get<{ data: ServiceList[], status: string }>(`${environment.apiUrl}servicesList?serviceGroupId=${id}`)
      .pipe(
        tap(_ => console.log('Fetched Services', _)),
        catchError(this.eh.handleHttpError<{ data: ServiceList[], status: string }>('getService'))
      );
  }
  getserviceGroupList(): Observable<{ data: serviceGroupList[], status: string }> {
    return this.http.get<{ data: serviceGroupList[], status: string }>(`${environment.apiUrl}serviceGroupList`)
      .pipe(
        tap(_ => console.log('Fetched Services', _)),
        catchError(this.eh.handleHttpError<{ data: serviceGroupList[], status: string }>('getserviceGroupList'))
      );
  }
  getCategories(serviceId: number): Observable<{ data: ServiceCategoryList[]; status: string }> {
    const url = `${environment.apiUrl}serviceCategories/${serviceId}?active=Y`;
    return this.http.get<{ data: ServiceCategoryList[]; status: string }>(url).pipe(
      tap((_) => console.log('Fetched Service Categories', _)),
      catchError(
        this.eh.handleHttpError<{ data: ServiceCategoryList[]; status: string }>(
          'getServiceCategories'
        )
      )
    );
  }

  insertMerchantService(formData) {
    return this.http
      .post<{ data: number; status: string }>(
        `${environment.apiUrl}merchantServices`,
        formData
      )
      .pipe(
        tap((_) => console.log('Insert Merchant Service Response: ', _)),
        catchError(
          this.eh.handleHttpError<{ data: number; status: string }>(
            'Insert Merchant Service'
          )
        )
      );
  }
  updateMerchantService(formData, merchantServiceId) {
    console.log(formData);
    return this.http
      .put<{ data: number; status: string }>(
        `${environment.apiUrl}merchantServices/${merchantServiceId}`,
        formData
      )
      .pipe(
        tap((_) => console.log('Update Merchant Service Response: ', _)),
        catchError(
          this.eh.handleHttpError<{ data: number; status: string }>(
            'Update Merchant Service'
          )
        )
      );
  }
  removeMerchantService(companyId: number) {
    return this.http
      .delete<{ data: string; status: string }>(`${environment.apiUrl}companies/${companyId}`)
      .pipe(
        tap((_) => console.log('delete company Response: ', _)),
        catchError(
          this.eh.handleHttpError<{ data: string; status: string }>(
            'delete company'
          )
        )
      );
  }

  getStylistGrades(): Observable<{ data: StylistGrade[], status: string }> {
    return this.http.get<{ data: StylistGrade[], status: string }>(
      `${environment.apiUrl}professionistGrades`).pipe(
        tap(_ => console.log('Success - Grade list fetch'),
          catchError(this.eh.handleHttpError('Error - Grade list fetch'))));
  }

  getServiceGenderCategory(): Observable<{ data: ServiceGenderCategory[], status: string }> {
    return this.http.get<{ data: ServiceGenderCategory[], status: string }>(`${environment.apiUrl}genderCategoriesList`).
      pipe(tap(_ => console.log('Fetch service gender category'),
        catchError(this.eh.handleHttpError('Error - Fetch service gender category'))));
  }

  // getServiceGenderCategory(): ServiceGenderCategory[] {
  //   return [
  //     {
  //       serviceGenderCategoryId: 1,
  //       name: 'For Men'
  //     }, {
  //       serviceGenderCategoryId: 2,
  //       name: 'For Women'
  //     }
  //   ];
  // }

}
