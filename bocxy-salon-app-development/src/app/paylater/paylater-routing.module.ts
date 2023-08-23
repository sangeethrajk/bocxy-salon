import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaylaterPage } from './paylater.page';

const routes: Routes = [
  {
    path: '',
    component: PaylaterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaylaterPageRoutingModule {}
