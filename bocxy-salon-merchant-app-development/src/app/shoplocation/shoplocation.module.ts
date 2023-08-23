import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShoplocationPageRoutingModule } from './shoplocation-routing.module';

import { ShoplocationPage } from './shoplocation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShoplocationPageRoutingModule
  ],
  declarations: [ShoplocationPage]
})
export class ShoplocationPageModule {}
