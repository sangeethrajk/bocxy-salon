import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalkincustomersPageRoutingModule } from './walkincustomers-routing.module';

import { WalkincustomersPage } from './walkincustomers.page';
import { AppointmentListService } from '../_services/appointmentlist.service';
import { DateService } from '../_services/date.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalkincustomersPageRoutingModule
  ],
  declarations: [WalkincustomersPage],
  providers: [AppointmentListService, DateService]
})
export class WalkincustomersPageModule { }
