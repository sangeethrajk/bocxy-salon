import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeealltreatmentPage } from './seealltreatment.page';

const routes: Routes = [
  {
    path: '',
    component: SeealltreatmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeealltreatmentPageRoutingModule {}
