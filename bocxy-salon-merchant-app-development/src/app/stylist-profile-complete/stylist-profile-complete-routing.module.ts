import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StylistProfieCompletePage } from './stylist-profile-complete.page';

const routes: Routes = [
  {
    path: '',
    component: StylistProfieCompletePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StylistProfieCompletePageRoutingModule { }
