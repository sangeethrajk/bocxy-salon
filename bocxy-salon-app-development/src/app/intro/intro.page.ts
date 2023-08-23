import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { MenuController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  @ViewChild('introSlider', { static: true }) slides: IonSlides;

  ionSlides: any;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  slideIndex = 0;
  swipeNext() {
    this.slides.slideNext();
  }
  constructor(
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    private storage: Storage
  ) {

  }

  ionViewWillEnter() {
    // the left menu should be disabled on the login page
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    // enable the left menu when leaving the login page
    this.menuCtrl.enable(true);
  }
  ngOnInit() {

  }

  slideChanged(e: any) {
    this.slides.getActiveIndex().then((index: number) => {
      this.slideIndex = index;
      console.log(index);
    });
  }

  getStarted() {
    this.storage.set('introscreenflag', "Y");
    this.navCtrl.navigateRoot('/login');
  }
}
