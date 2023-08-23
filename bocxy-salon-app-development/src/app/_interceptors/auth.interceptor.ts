import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '../_services/shared.service';
import { Storage } from '@ionic/storage';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
  token: string;

  ignoreUrl = [
    'outpost.mapmyindia.com',
    'bocxy-merchant-new.s3.ap-south-1.amazonaws.com'
  ];

  constructor(private sharedService: SharedService, private storage: Storage) {
    this.sharedService.currentAuthTokenCheck.subscribe(async data => {
      console.log(data, 'subscribe data');
      this.token = data;
    });
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const idToken = this.token;
    let urlCheck = true;
    for (const word of this.ignoreUrl) { if (req.url.includes(word)) { urlCheck = false; } }
    if (urlCheck) {
      if (idToken) {
        const cloned = req.clone({
          headers: req.headers.set('Authorization',
            'Bearer ' + idToken)
        });

        return next.handle(cloned);
      } else {
        return next.handle(req);
      }
    } else {
      return next.handle(req);
    }
  }
}
