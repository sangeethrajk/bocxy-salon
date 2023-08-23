import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OffersmgmtPageRoutingModule } from './offersmgmt-routing.module';

import { OffersmgmtPage } from './offersmgmt.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OffersmgmtPageRoutingModule
  ],
  declarations: [OffersmgmtPage]
})
export class OffersmgmtPageModule { }
