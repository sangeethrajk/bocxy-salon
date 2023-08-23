import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpecialbhhistoryPage } from './specialbhhistory.page';

const routes: Routes = [
  {
    path: '',
    component: SpecialbhhistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecialbhhistoryPageRoutingModule {}
