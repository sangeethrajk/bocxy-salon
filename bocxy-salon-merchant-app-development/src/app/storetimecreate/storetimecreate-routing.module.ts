import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoretimecreatePage } from './storetimecreate.page';

const routes: Routes = [
  {
    path: '',
    component: StoretimecreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoretimecreatePageRoutingModule {}
