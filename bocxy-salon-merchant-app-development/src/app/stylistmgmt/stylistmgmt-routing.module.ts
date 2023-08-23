import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StylistmgmtPage } from './stylistmgmt.page';

const routes: Routes = [
  {
    path: '',
    component: StylistmgmtPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StylistmgmtPageRoutingModule {}
