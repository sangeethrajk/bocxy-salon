import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewServicedetailPage } from './view-servicedetail.page';

const routes: Routes = [
  {
    path: '',
    component: ViewServicedetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewServicedetailPageRoutingModule {}
