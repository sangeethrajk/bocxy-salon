import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { ErrorHandler } from './error-handler.service';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    userData: any;

    constructor(
        private http: HttpClient,
        private eh: ErrorHandler,
        private storage: Storage
    ) { }

    async checkPermissionAccess(name: any) {
        this.userData = await this.storage.get('userData');
        let permissions = this.userData.permissions;
        if (!this.userData.roleCodes.includes('MR')) {
            if (permissions && permissions.length > 0) {
                return permissions.includes(name);
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }

    }
}
