import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HolidaymgmtPageRoutingModule } from './holidaymgmt-routing.module';

import { HolidaymgmtPage } from './holidaymgmt.page';
import { HolidaymgmtService } from './holidaymgmt.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HolidaymgmtPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [HolidaymgmtPage],
  providers: [HolidaymgmtService]
})
export class HolidaymgmtPageModule { }
