import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpsupportPage } from './helpsupport.page';

const routes: Routes = [
  {
    path: '',
    component: HelpsupportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpsupportPageRoutingModule {}
