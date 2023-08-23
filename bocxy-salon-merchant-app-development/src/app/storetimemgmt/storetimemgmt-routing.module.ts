import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoretimemgmtPage } from './storetimemgmt.page';

const routes: Routes = [
  {
    path: '',
    component: StoretimemgmtPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoretimemgmtPageRoutingModule {}
