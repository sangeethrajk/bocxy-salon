import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddstylistPage } from './addstylist.page';

const routes: Routes = [
  {
    path: '',
    component: AddstylistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddstylistPageRoutingModule {}
