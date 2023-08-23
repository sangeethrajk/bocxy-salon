import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable()
export class HardBackService {
  constructor(private platform: Platform) { }
  backToExit() {
    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      console.log('Back press handler!');
      if (window.confirm('Do you want to exit the app?')) {
        // tslint:disable-next-line: no-string-literal
        navigator['app'].exitApp();
      }
    });
    this.platform.backButton.subscribeWithPriority(5, () => {
      // tslint:disable-next-line: no-string-literal
      navigator['app'].exitApp();
    });
  }
}


    // Back Button
    // document.addEventListener(
    //   'backbutton',
    //   () => {
    //     if (this.router.url.indexOf('/home/tabs/tab1') >= 0) {
    //       if (window.confirm('Do you want to exit the app?')) {
    //         // tslint:disable-next-line: no-string-literal
    //         navigator['app'].exitApp();
    //       }
    //     }
    //     else {
    //     }
    //   }
    // );
