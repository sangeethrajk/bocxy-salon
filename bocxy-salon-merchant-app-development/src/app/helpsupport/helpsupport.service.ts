import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { ErrorHandler } from "../_services/error-handler.service";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};
@Injectable()
export class helpSupportService {
  constructor(private http: HttpClient, private eh: ErrorHandler) {}
  sendMail(postData): Observable<{ data: boolean; status: string }> {
    return this.http
      .post<{ data: boolean; status: string }>(
        `${environment.apiUrl}sendCustomerSupport`,
        postData,
        httpOptions
      )
      .pipe(
        tap((_) => console.log("sendCustomerSupport", _)),
        catchError(
          this.eh.handleHttpError<{ data: boolean; status: string }>(
            "sendCustomerSupport"
          )
        )
      );
  }
}
