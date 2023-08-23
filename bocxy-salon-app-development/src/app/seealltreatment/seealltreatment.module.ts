import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeealltreatmentPageRoutingModule } from './seealltreatment-routing.module';

import { SeealltreatmentPage } from './seealltreatment.page';
import { AllServices } from '../formen/allServices.service';
import { DirectivesModule } from '../_directives/directives.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeealltreatmentPageRoutingModule,
    DirectivesModule
  ],
  declarations: [SeealltreatmentPage],
  providers: [AllServices]
})
export class SeealltreatmentPageModule { }
