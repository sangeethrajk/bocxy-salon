import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Stylist } from "../tab1/tab1.model";
import { ErrorHandler } from "../_services/error-handler.service";
import { ServiceDetails } from "./addanotherservice.model";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable()
export class AddAnotherServiceService {
  constructor(private http: HttpClient, private eh: ErrorHandler) {

  }

  getProfessionalList(): Observable<{ data: Stylist[]; status: string }> {
    return this.http
      .get<{ data: Stylist[]; status: string }>(
        `${environment.apiUrl}stylistList`, httpOptions)
      .pipe(
        tap(_ => console.log('Fetched List')),
        catchError(this.eh.handleHttpError<{ data: Stylist[], status: string }>('List not fetched'))
      );
  }

  addService(service: ServiceDetails): Observable<{ data: boolean, status: string }> {
    return this.http.post<{ data: boolean, status: string }>(`${environment.apiUrl}appointmentServiceTemporary`, service)
      .pipe(tap(_ => { console.log('Added service') }),
        catchError(this.eh.handleHttpError<{ data: boolean, status: string }>('Failed to add service')));
  }
}