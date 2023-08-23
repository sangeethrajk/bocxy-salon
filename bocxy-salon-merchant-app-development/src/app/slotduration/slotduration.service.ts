import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandler } from '../_services/error-handler.service';
import { SlotGroup } from '../_models/slotGroup.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable()

export class SlotDurationServcie {

    constructor(private http: HttpClient, private eh: ErrorHandler) { }

    UpdateSlotDuration(postData) {
        return this.http.post<{ data: boolean; status: string }>(`${environment.apiUrl}accountSlots`, postData, httpOptions)
            .pipe(
                tap(_ => console.log('SoltDurationUpdated', _)),
                catchError(this.eh.handleHttpError<{ data: boolean; status: string }>('SlotDuration'))
            );
    }

    GetSlotGroupList(){        
        return this.http.get<{ data: SlotGroup[]; status: string }>(`${environment.apiUrl}slotGroupList`)
        .pipe( tap(_ => console.log('Slot group list fetch')),
        catchError(this.eh.handleHttpError<{ data: SlotGroup[]; status: string }>('slotGroupList')));
    }
}

