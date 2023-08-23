import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoplocationPage } from './shoplocation.page';

const routes: Routes = [
  {
    path: '',
    component: ShoplocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoplocationPageRoutingModule {}
