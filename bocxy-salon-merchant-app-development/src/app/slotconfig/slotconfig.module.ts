import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SlotconfigPageRoutingModule } from './slotconfig-routing.module';

import { SlotconfigPage } from './slotconfig.page';
import { SlotConfigService } from './slogconfig.service';
import { DateService } from '../_services/date.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SlotconfigPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SlotconfigPage],
  providers: [SlotConfigService, DateService]
})
export class SlotconfigPageModule { }
