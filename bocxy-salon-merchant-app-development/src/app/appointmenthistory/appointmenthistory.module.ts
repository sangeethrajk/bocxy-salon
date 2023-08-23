import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RandomcolorModule } from 'angular-randomcolor';

import { IonicModule } from '@ionic/angular';

import { AppointmentHistoryPageRoutingModule } from './appointmenthistory-routing.module';

import { AppointmentHistoryPage } from './appointmenthistory.page';
import { AppointmentHistoryService } from './appointmentlist.service';
import { DateService } from '../_services/date.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RandomcolorModule,
    AppointmentHistoryPageRoutingModule
  ],
  declarations: [AppointmentHistoryPage],
  providers: [AppointmentHistoryService, DateService]
})
export class AppointmentHistoryPageModule { }
