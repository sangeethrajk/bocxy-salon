import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatepwPage } from './createpw.page';

const routes: Routes = [
  {
    path: '',
    component: CreatepwPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatepwPageRoutingModule {}
