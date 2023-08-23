import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ErrorhandlerService } from './errorhandler.service';
import { catchError, tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class FcmService {

  constructor(
    private platform: Platform,
    private http: HttpClient, private eh: ErrorhandlerService, private storage: Storage,
    private firebaseX: FirebaseX
  ) { }

  // notifcations(postData) {
  //     return this.http.post<{ data: boolean; status: string }>(`${environment.apiUrl}notfications`, postData, httpOptions)
  //         .pipe(
  //             tap(_ => console.log('registerProfile', _)),
  //             catchError(this.eh.handleHttpError<{ data: boolean; status: string }>('registerProfile'))
  //         );
  // }
  notifcations(formData) {
    return this.http
      .post<{ data: number; status: string }>(
        `${environment.apiUrl}notfications`,
        formData
      )
      .pipe(
        tap((_) => console.log('Insert Notifications : ', _)),
        catchError(
          this.eh.handleHttpError<{ data: number; status: string }>(
            'Insert Notifications Stylist'
          )
        )
      );
  }

  async getToken() {
    let token;


    if (this.platform.is('android')) {
      const permissionRes = await this.firebaseX.grantPermission();
      if (permissionRes) {
        token = await this.firebaseX.getToken();
      }
    }

    if (this.platform.is('ios')) {
      // const options: IRequestPushPermissionOptions;
      const permissionRes = await this.firebaseX.grantPermission();
      if (permissionRes) {
        token = await this.firebaseX.getToken();
      }
    }

    this.saveToken(token);
  }

  private saveToken(token) {
    console.log('token', token);

    if (!token) { return; }

    const postData = {
      token
    };
    this.notifcations(postData).subscribe(async data => {
      console.log(data);
    });

  }

  onNotifications() {
    return this.firebaseX.onMessageReceived().subscribe(data => {
      if (data.wasTapped) {
        console.log('Received in background');
      } else {
        console.log('Received in foreground');
      }
    });
  }
  // ionic push notification
  onRefresh() {
    // refresh the FCM token
    return this.firebaseX.onTokenRefresh().subscribe(token => {
      console.log(token);
      this.storage.set('notficationtoken', token);
    });
  }

}
