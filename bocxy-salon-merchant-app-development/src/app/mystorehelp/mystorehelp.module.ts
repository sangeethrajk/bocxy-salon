import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MystorehelpPageRoutingModule } from './mystorehelp-routing.module';

import { MystorehelpPage } from './mystorehelp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MystorehelpPageRoutingModule
  ],
  declarations: [MystorehelpPage]
})
export class MystorehelpPageModule {}
