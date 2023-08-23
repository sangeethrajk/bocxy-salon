import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CancelledPageRoutingModule } from './cancelled-routing.module';

import { CancelledPage } from './cancelled.page';
import { CancelledService } from './cancelled.service';
import { DateService } from '../_services/date.service';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CancelledPageRoutingModule
  ],
  declarations: [CancelledPage],
  providers: [CancelledService, DateService]
})
export class CancelledPageModule { }
