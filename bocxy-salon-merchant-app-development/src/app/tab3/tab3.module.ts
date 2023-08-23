import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { IonicModule } from '@ionic/angular';

import { Tab3PageRoutingModule } from './tab3-routing.module';

import { Tab3Page } from './tab3.page';
import { Tab3Servcie } from './tab3.service';
import { AppointmentServiceService } from '../appointmentservice/appointmentservice.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab3PageRoutingModule,
    ReactiveFormsModule,
    Ng2TelInputModule
  ],
  declarations: [Tab3Page],
  providers: [Tab3Servcie, AppointmentServiceService]
})
export class Tab3PageModule { }
