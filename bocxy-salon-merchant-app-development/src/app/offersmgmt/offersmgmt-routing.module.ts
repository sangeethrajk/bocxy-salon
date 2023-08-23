import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OffersmgmtPage } from './offersmgmt.page';

const routes: Routes = [
  {
    path: '',
    component: OffersmgmtPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffersmgmtPageRoutingModule {}
