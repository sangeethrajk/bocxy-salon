import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaylaterPageRoutingModule } from './paylater-routing.module';

import { PaylaterPage } from './paylater.page';
import { PaylaterService } from './paylater.service';
import { DateService } from '../_services/date.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaylaterPageRoutingModule
  ],
  declarations: [PaylaterPage],
  providers: [PaylaterService, DateService]
})
export class PaylaterPageModule { }
