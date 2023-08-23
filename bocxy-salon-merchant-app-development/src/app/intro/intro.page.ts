import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  // @ViewChild('introSlider') slides: IonSlides;
  @ViewChild('introSlider', { static: false }) slides: IonSlides;

  intro = 0;
  selectedSlide: any;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1
  };
  swipeNext() {
    this.slides.slideNext();
  }
  constructor(public menuCtrl: MenuController,
    public navCtrl: NavController,) {

  }

  ngOnInit() {

  }

  async slidesChanged(slides: IonSlides) {
    this.selectedSlide = slides;
    this.intro = await slides.getActiveIndex();
    console.log("Selected slide is" + " " + this.intro);
  }

  goToHome() {
    this.navCtrl.navigateRoot('/home/tabs/tab1')
  }
}
