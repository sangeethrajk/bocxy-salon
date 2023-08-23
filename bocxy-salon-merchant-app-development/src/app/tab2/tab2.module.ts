import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab2PageRoutingModule } from './tab2-routing.module';

import { Tab2Page } from './tab2.page';
import { ListMerchantServiceService } from './tab2.service';
import { StoreDefaultSlotsServices } from '../defaultservicetime/defaultservices.service';
import { DirectivesModule } from '../_directives/directives.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab2PageRoutingModule,
    DirectivesModule
  ],
  declarations: [Tab2Page],
  providers: [ListMerchantServiceService, StoreDefaultSlotsServices]
})
export class Tab2PageModule { }
