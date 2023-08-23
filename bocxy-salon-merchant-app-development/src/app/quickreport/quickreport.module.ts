import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuickreportPageRoutingModule } from './quickreport-routing.module';

import { QuickreportPage } from './quickreport.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuickreportPageRoutingModule
  ],
  declarations: [QuickreportPage]
})
export class QuickreportPageModule {}
