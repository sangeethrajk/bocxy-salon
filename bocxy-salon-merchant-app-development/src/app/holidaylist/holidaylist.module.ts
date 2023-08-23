import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HolidaylistPageRoutingModule } from './holidaylist-routing.module';

import { HolidaylistPage } from './holidaylist.page';
import { HolidayListService } from './holidaylist.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HolidaylistPageRoutingModule
  ],
  declarations: [HolidaylistPage],
  providers: [HolidayListService]
})
export class HolidaylistPageModule { }
