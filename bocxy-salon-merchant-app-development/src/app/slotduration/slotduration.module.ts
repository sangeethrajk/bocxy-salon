import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SlotdurationPageRoutingModule } from './slotduration-routing.module';

import { SlotdurationPage } from './slotduration.page';
import {SlotDurationServcie} from './slotduration.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SlotdurationPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SlotdurationPage],
  providers:[SlotDurationServcie]
})
export class SlotdurationPageModule {}
