import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentmodePageRoutingModule } from './paymentmode-routing.module';

import { PaymentmodePage } from './paymentmode.page';
import { PaymentModeService } from './paymentmode.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentmodePageRoutingModule
  ],
  declarations: [PaymentmodePage],
  providers: [PaymentModeService]
})
export class PaymentmodePageModule { }
