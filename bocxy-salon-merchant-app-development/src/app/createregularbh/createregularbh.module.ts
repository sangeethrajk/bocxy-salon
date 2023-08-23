import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateregularbhPageRoutingModule } from './createregularbh-routing.module';

import { CreateregularbhPage } from './createregularbh.page';
import { SlotTimeCreateService } from '../storetimecreate/slottimecreate.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateregularbhPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CreateregularbhPage],  
  providers:[ SlotTimeCreateService]
})
export class CreateregularbhPageModule {}
