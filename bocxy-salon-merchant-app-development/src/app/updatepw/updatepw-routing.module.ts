import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdatepwPage } from './updatepw.page';

const routes: Routes = [
  {
    path: '',
    component: UpdatepwPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdatepwPageRoutingModule { }
