import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { TimeSlot, Stylist, AppointmentBooking } from './specialbooking.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()

export class SpecialBookingService {
  constructor(private http: HttpClient, private eh: ErrorHandler) {

  }

  GetAppointmentDate() {
    return this.http.get<{ data: string[], status: string }>(`${environment.apiUrl}appointmentDates`, httpOptions).
      pipe(
        tap(_ => console.log("appointment dates")),
        catchError(this.eh.handleHttpError<{ data: string[], status: string }>('Appointment dates', { data: [], status: "Failure" }))
      );
  }

  GetStylistList() {
    return this.http.get<{ data: Stylist[], status: string }>(`${environment.apiUrl}stylistList`, httpOptions).
      pipe(
        tap(_ => console.log("stylist")),
        catchError(this.eh.handleHttpError<{ data: Stylist[], status: string }>('stylist', { data: [], status: "Failure" }))
      );
  }

  GetDateSlots(serviceId: number, date: String) {
    return this.http.get<{ data: any, status: string }>(`${environment.apiUrl}appointmentSlots/${serviceId}/${date}`, httpOptions).
      pipe(
        tap(_ => console.log("Appoinment date slot")),
        catchError(this.eh.handleHttpError<{ data: any, status: string }>('Appoinment date slot', { data: [], status: "Failure" }))
      );
  }

  GetStylistSlots(stylistAccountId: number, date: string) {
    //var url = stylistAccountId == 0 || stylistAccountId == null ? `${environment.apiUrl}appointmentStylistSlots/` :  `${environment.apiUrl}appointmentStylistSlots/${stylistAccountId}`;    
    return this.http.get<{ data: TimeSlot[], status: string }>(`${environment.apiUrl}appointmentStylistSlots/${stylistAccountId}/${date}`, httpOptions).
      pipe(
        tap(_ => console.log("Appoinment style slot")),
        catchError(this.eh.handleHttpError<{ data: TimeSlot[], status: string }>('Appoinment style slot', { data: [], status: "Failure" }))
      );
  }

  BookAppointment(data: AppointmentBooking) {
    return this.http.post<{ data: any; status: string }>(`${environment.apiUrl}appointment`, data, httpOptions)
      .pipe(
        tap(_ => console.log('Appointment booked', _)),
        catchError(this.eh.handleHttpError<{ data: boolean; status: string }>('Appointment booking error'))
      );
  }

  GetStylistByService(id: number) {
    return this.http.get<{ data: any, status: string }>(`${environment.apiUrl}stylistByService/${id}`, httpOptions).
      pipe(
        tap(_ => console.log("stylist")),
        catchError(this.eh.handleHttpError<{ data: any, status: string }>('stylist', { data: [], status: "Failure" }))
      );
  }
}