import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentmodePage } from './paymentmode.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentmodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentmodePageRoutingModule {}
