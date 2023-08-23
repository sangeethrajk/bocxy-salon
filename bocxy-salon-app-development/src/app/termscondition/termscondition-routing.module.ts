import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermsconditionPage } from './termscondition.page';

const routes: Routes = [
  {
    path: '',
    component: TermsconditionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermsconditionPageRoutingModule {}
