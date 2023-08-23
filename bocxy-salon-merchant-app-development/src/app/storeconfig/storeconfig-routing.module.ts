import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreconfigPage } from './storeconfig.page';

const routes: Routes = [
  {
    path: '',
    component: StoreconfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreconfigPageRoutingModule {}
