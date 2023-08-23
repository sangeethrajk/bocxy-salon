import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultservicetimePage } from './defaultservicetime.page';

const routes: Routes = [
  {
    path: '',
    component: DefaultservicetimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefaultservicetimePageRoutingModule {}
