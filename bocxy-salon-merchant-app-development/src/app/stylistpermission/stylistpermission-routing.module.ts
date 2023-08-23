import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StylistpermissionPage } from './stylistpermission.page';

const routes: Routes = [
  {
    path: '',
    component: StylistpermissionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StylistpermissionPageRoutingModule {}
