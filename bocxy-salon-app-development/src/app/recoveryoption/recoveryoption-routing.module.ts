import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecoveryoptionComponent } from './recoveryoption.page';

const routes: Routes = [
  {
    path: '',
    component: RecoveryoptionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecoveryoptionPageRoutingModule {}
