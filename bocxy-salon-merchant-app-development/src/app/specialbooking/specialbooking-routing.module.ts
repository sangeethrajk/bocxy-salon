import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpecialbookingPage } from './specialbooking.page';

const routes: Routes = [
  {
    path: '',
    component: SpecialbookingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecialbookingPageRoutingModule {}
