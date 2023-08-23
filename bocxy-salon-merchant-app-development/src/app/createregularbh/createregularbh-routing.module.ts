import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateregularbhPage } from './createregularbh.page';

const routes: Routes = [
  {
    path: '',
    component: CreateregularbhPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateregularbhPageRoutingModule {}
