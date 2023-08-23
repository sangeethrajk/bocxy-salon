import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailappointmentPageRoutingModule } from './detailappointment-routing.module';

import { DetailappointmentPage } from './detailappointment.page';
import { DetailAppointmentService } from './detailappointment.service';
import { AppointmentListService } from '../_services/appointmentlist.service';
import { DateService } from '../_services/date.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailappointmentPageRoutingModule
  ],
  declarations: [DetailappointmentPage],
  providers: [DetailAppointmentService, AppointmentListService, DateService]
})
export class DetailappointmentPageModule { }
