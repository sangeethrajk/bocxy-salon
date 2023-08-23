import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorhandlerService } from '../_services/errorhandler.service';
import { AppointmentDetail } from './detailappointment.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}
@Injectable()
export class DetailAppointmentService {
  constructor(private http: HttpClient, private eh: ErrorhandlerService) {

  }

  getAppointmentDetails(id: number): Observable<{ data: AppointmentDetail, status: string }> {
    return this.http.get<{ data: AppointmentDetail, status: string }>(`${environment.apiUrl}customerAppointments/${id}`).pipe(
      tap(),
      catchError(this.eh.handleHttpError<{ data: AppointmentDetail, status: string }>('Failed to get appointment details'))
    );
  }
}