import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreconfigPageRoutingModule } from './storeconfig-routing.module';

import { StoreconfigPage } from './storeconfig.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreconfigPageRoutingModule
  ],
  declarations: [StoreconfigPage]
})
export class StoreconfigPageModule { }
