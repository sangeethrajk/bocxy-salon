import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeemoreservicePage } from './seemoreservice.page';

const routes: Routes = [
  {
    path: '',
    component: SeemoreservicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeemoreservicePageRoutingModule {}
