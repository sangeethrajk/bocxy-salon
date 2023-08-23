import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecoveryotpComponent } from './recoveryotp.page';

const routes: Routes = [
  {
    path: '',
    component: RecoveryotpComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecoveryotpPageRoutingModule {}
