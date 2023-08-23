import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppointmentlistPageRoutingModule } from './appointmentlist-routing.module';

import { AppointmentlistPage } from './appointmentlist.page';
import { AppointmentListService } from '../_services/appointmentlist.service';
import { DateService } from '../_services/date.service';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppointmentlistPageRoutingModule
  ],
  declarations: [AppointmentlistPage],
  providers: [AppointmentListService, DateService]
})
export class AppointmentlistPageModule { }
