import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailappointmentPageRoutingModule } from './detailappointment-routing.module';

import { DetailappointmentPage } from './detailappointment.page';
import { TranslateModule } from '@ngx-translate/core';
import { DetailAppointmentService } from './detailappointment.service';
import { DateService } from '../_services/date.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    DetailappointmentPageRoutingModule
  ],
  declarations: [DetailappointmentPage],
  providers: [DetailAppointmentService, DateService]
})
export class DetailappointmentPageModule { }
