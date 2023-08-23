import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HolidaymgmtPage } from './holidaymgmt.page';

const routes: Routes = [
  {
    path: '',
    component: HolidaymgmtPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HolidaymgmtPageRoutingModule {}
