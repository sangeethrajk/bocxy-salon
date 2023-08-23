import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GrademgmtPage } from './grademgmt.page';

const routes: Routes = [
  {
    path: '',
    component: GrademgmtPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GrademgmtPageRoutingModule {}
