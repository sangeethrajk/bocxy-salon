import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegularbhhistoryPage } from './regularbhhistory.page';

const routes: Routes = [
  {
    path: '',
    component: RegularbhhistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegularbhhistoryPageRoutingModule {}
