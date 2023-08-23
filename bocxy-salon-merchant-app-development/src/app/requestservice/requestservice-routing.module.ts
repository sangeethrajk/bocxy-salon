import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestservicePage } from './requestservice.page';

const routes: Routes = [
  {
    path: '',
    component: RequestservicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestservicePageRoutingModule {}
