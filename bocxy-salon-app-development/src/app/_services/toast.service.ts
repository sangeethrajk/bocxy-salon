import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable()
export class ToastService {
  constructor(private tstCtrl: ToastController) { }
  async showToast(data?: string) {
    const toast = await this.tstCtrl.create({
      message: data || 'Connection failed! try again',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
}
