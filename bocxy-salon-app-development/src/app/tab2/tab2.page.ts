import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {

  constructor() { }
  offersItems = [
    { name: 'Tony&Guy Essensuals', offer: '50% Offer on all tye of facials', description: '*Offers Valid till 30 October 2020.', img: './assets/img/h-slide-1.jpg', color: this.getRandomColor() },
    { name: 'Tony&Guy Essensuals', offer: '20% Offer on skin treatment', description: '*Offers Valid till 20 October 2020.', img: './assets/img/beautytreatment.jpg', color: this.getRandomColor() },
    { name: 'Tony&Guy Essensuals', offer: '15% Offer on all tye of mens facials', description: '*Offers Valid till 12 October 2020.', img: './assets/img/mensfacial.jpg', color: this.getRandomColor() }
  ];

  /*Get random color for offers card*/
  getRandomColor() {
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const part = Math.round(Math.random() * 255 + 0.1).toString(16);
      color += (part.length > 1) ? part : '0' + part;
    }
    return color;
  }

  ngOnInit() {
  }

}
