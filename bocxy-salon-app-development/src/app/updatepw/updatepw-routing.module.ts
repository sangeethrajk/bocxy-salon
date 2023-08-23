import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdatepwComponent } from './updatepw.page';

const routes: Routes = [
  {
    path: '',
    component: UpdatepwComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdatepwPageRoutingModule { }
