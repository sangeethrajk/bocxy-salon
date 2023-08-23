import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyotpComponent } from './verifyotp.page';

const routes: Routes = [
  {
    path: '',
    component: VerifyotpComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyOtpComponentRoutingModule { }
