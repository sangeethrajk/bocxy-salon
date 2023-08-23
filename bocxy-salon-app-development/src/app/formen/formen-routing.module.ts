import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormenPage } from './formen.page';

const routes: Routes = [
  {
    path: '',
    component: FormenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormenPageRoutingModule {}
