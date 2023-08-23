import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { NavigationHandler } from '../_services/navigation-handler.service';
@Component({
  selector: 'app-calendarsettings',
  templateUrl: './calendarsettings.page.html',
  styleUrls: ['./calendarsettings.page.scss'],
})
export class CalendarsettingsPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  bhours = 'regular';
  showDetails: boolean;
  constructor(
    private nav: NavigationHandler
  ) { }

  timing = [
    { day: 'Sunday', start: '08.00 AM', end: '10.00 PM' },
    { day: 'Monday', start: '08.00 AM', end: '10.00 PM' },
    { day: 'Tuesday', start: '08.00 AM', end: '10.00 PM' },
    { day: 'Wednesday', start: '08.00 AM', end: '10.00 PM' },
    { day: 'Thursday', start: '08.00 AM', end: '10.00 PM' },
    { day: 'Friday', start: '08.00 AM', end: '10.00 PM' },
    { day: 'Saturday', start: '08.00 AM', end: '10.00 PM' }
  ];

  ngOnInit() {
  }


  toggleDetails() {
    this.showDetails = !this.showDetails;

  }
  scrollToTop() {
    this.content.scrollToTop();
  }

  async segmentChanged(ev) {
    this.scrollToTop();
    console.log(this.bhours);

  }
  previous() {
    this.nav.GoBackTo('/home/tabs/storeconfig');
  }
  navigate(slotType: string) {
    const param = { type: slotType, data: null };
    this.nav.GoForward('/storetimecreate', { state: param });
  }
}
