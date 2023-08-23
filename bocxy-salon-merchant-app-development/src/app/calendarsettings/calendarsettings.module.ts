import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarsettingsPageRoutingModule } from './calendarsettings-routing.module';
import { PermanentslotsPage } from '../permanentslots/permanentslots.page';
import { PermanentSlotService } from '../permanentslots/permanentslots.service';
import { DateService } from '../_services/date.service';

import { CalendarsettingsPage } from './calendarsettings.page';
import { SpecialslotsPage } from '../specialslots/specialslots.page';
import { SpecialSlotService } from '../specialslots/specialslot.service';
import { DirectivesModule } from '../_directives/directives.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarsettingsPageRoutingModule,
    DirectivesModule
  ],
  declarations: [CalendarsettingsPage, PermanentslotsPage, SpecialslotsPage],
  providers: [PermanentSlotService, SpecialSlotService, DateService]
})
export class CalendarsettingsPageModule { }
