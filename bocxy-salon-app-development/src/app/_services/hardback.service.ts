import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HardbackService {

  constructor(private platform: Platform) { }
  backToExit() {
    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      console.log('Back press handler!');
      // tslint:disable-next-line: no-string-literal
      navigator['app'].exitApp();
    });
    this.platform.backButton.subscribeWithPriority(5, () => {
      // tslint:disable-next-line: no-string-literal
      navigator['app'].exitApp();
    });
  }
}
