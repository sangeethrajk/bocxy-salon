import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewServicedetailPageRoutingModule } from './view-servicedetail-routing.module';

import { ViewServicedetailPage } from './view-servicedetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewServicedetailPageRoutingModule
  ],
  declarations: [ViewServicedetailPage]
})
export class ViewServicedetailPageModule {}
