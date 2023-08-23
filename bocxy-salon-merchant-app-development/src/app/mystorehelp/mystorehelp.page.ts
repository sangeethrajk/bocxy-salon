import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-mystorehelp',
  templateUrl: './mystorehelp.page.html',
  styleUrls: ['./mystorehelp.page.scss'],
})
export class MystorehelpPage implements OnInit {

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

}
