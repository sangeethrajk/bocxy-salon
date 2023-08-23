import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddanotherservicePageRoutingModule } from './addanotherservice-routing.module';

import { AddanotherservicePage } from './addanotherservice.page';
import { AddAnotherServiceService } from './addanotherservice.service';
import { AppointmentServiceService } from '../appointmentservice/appointmentservice.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddanotherservicePageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [AddanotherservicePage],
  providers: [AddAnotherServiceService, AppointmentServiceService]
})
export class AddanotherservicePageModule { }
