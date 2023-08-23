import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { DateService } from '../_services/date.service';
import { NewAppointmentlistPageRoutingModule } from './newappointmentlist-routing.module';

import { NewAppointmentlistPage } from './newappointmentlist.page';
import { AppointmentListService } from '../_services/appointmentlist.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewAppointmentlistPageRoutingModule
  ],
  declarations: [NewAppointmentlistPage],
  providers: [AppointmentListService, DateService]
})
export class NewAppointmentlistPageModule { }
