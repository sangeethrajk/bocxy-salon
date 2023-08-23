import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { IonicModule } from '@ionic/angular';

import { SpecialbookingPageRoutingModule } from './specialbooking-routing.module';

import { SpecialbookingPage } from './specialbooking.page';
import { SpecialBookingService } from './specialbooking.service';
import { AppointmentServiceService } from '../appointmentservice/appointmentservice.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpecialbookingPageRoutingModule,
    ReactiveFormsModule,
    Ng2TelInputModule
  ],
  declarations: [SpecialbookingPage],
  providers: [SpecialBookingService, AppointmentServiceService]
})
export class SpecialbookingPageModule { }
