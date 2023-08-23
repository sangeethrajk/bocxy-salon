import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeemoreservicePageRoutingModule } from './seemoreservice-routing.module';

import { SeemoreservicePage } from './seemoreservice.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SeemoreservicePageRoutingModule
  ],
  declarations: [SeemoreservicePage]
})
export class SeemoreservicePageModule { }
