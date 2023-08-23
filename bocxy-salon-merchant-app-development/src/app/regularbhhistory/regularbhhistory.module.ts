import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegularbhhistoryPageRoutingModule } from './regularbhhistory-routing.module';

import { RegularbhhistoryPage } from './regularbhhistory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegularbhhistoryPageRoutingModule
  ],
  declarations: [RegularbhhistoryPage]
})
export class RegularbhhistoryPageModule {}
