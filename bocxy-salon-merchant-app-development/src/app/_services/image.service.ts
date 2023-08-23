import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private storage: Storage
  ) { }
  async saveImage(imageUrl) {
    const resp = new Promise((res, rej) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.storage.set(imageUrl, reader.result);
          res(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', imageUrl);
      xhr.responseType = 'blob';
      xhr.send();
    });
    return await resp;
  }
}
