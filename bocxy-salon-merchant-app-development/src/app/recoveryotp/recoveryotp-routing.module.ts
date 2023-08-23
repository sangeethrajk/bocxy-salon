import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecoveryotpPage } from './recoveryotp.page';

const routes: Routes = [
  {
    path: '',
    component: RecoveryotpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecoveryotpPageRoutingModule {}
