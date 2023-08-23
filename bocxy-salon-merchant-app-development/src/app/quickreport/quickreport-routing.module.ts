import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuickreportPage } from './quickreport.page';

const routes: Routes = [
  {
    path: '',
    component: QuickreportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuickreportPageRoutingModule {}
