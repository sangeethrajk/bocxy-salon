import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddanotherservicePage } from './addanotherservice.page';

const routes: Routes = [
  {
    path: '',
    component: AddanotherservicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddanotherservicePageRoutingModule {}
