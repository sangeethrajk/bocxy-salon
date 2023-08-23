import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecoveryoptionPage } from './recoveryoption.page';

const routes: Routes = [
  {
    path: '',
    component: RecoveryoptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecoveryoptionPageRoutingModule {}
