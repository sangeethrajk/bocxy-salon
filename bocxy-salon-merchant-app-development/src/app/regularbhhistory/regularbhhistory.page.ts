import { Component, OnInit } from '@angular/core';
import { SharedService } from '../_services/shared.service';
import { NavigationHandler } from '../_services/navigation-handler.service';

@Component({
  selector: 'app-regularbhhistory',
  templateUrl: './regularbhhistory.page.html',
  styleUrls: ['./regularbhhistory.page.scss'],
})
export class RegularbhhistoryPage implements OnInit {

  slotsHistroys: Array<{
    merchantSlotId: number;
    name: string;
    startDate: string;
    endDate: string;
    isActive?: boolean;
    closingTime: string;
    openingTime: string;
    weekdayFlag: string;
    weekdays: any[];
  }>;

  weekDayMapping = { 1: 'Sunday', 2: 'Monday', 3: 'Tuesday', 4: 'Wednesday', 5: 'Thursday', 6: 'Friday', 7: 'Saturday' };

  constructor(
    private sharedService: SharedService,
    private nav: NavigationHandler
  ) {
  }

  ngOnInit() {
    this.sharedService.currentSlotHistroy.subscribe(async data => {
      this.slotsHistroys = data;
    });
  }
  previous() {
    this.nav.GoBackTo('/calendarsettings');
  }
}
