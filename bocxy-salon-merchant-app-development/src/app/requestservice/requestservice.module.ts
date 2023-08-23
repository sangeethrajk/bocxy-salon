import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestservicePageRoutingModule } from './requestservice-routing.module';

import { RequestservicePage } from './requestservice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestservicePageRoutingModule
  ],
  declarations: [RequestservicePage]
})
export class RequestservicePageModule {}
