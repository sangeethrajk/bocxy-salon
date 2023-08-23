import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { IonicModule } from '@ionic/angular';

import { BookappointmentPageRoutingModule } from './bookappointment-routing.module';

import { BookappointmentPage } from './bookappointment.page';
import { BookAppointmentService } from './bookappointment.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FontAwesomeModule,
    BookappointmentPageRoutingModule
  ],
  declarations: [BookappointmentPage],
  providers: [BookAppointmentService]
})
export class BookappointmentPageModule { }
