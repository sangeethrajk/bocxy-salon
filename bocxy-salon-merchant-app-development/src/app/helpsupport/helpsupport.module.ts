import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HelpsupportPageRoutingModule } from './helpsupport-routing.module';
import { helpSupportService } from '../helpsupport/helpsupport.service';
import { HelpsupportPage } from './helpsupport.page';
import { UsermanualPage } from '../usermanual/usermanual.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HelpsupportPageRoutingModule
  ],
  declarations: [HelpsupportPage, UsermanualPage],
  providers: [helpSupportService]
})
export class HelpsupportPageModule { }
