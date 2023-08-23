import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpecialbhhistoryPageRoutingModule } from './specialbhhistory-routing.module';

import { SpecialbhhistoryPage } from './specialbhhistory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpecialbhhistoryPageRoutingModule
  ],
  declarations: [SpecialbhhistoryPage]
})
export class SpecialbhhistoryPageModule {}
