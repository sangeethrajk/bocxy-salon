import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SlotconfigPage } from './slotconfig.page';

const routes: Routes = [
  {
    path: '',
    component: SlotconfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SlotconfigPageRoutingModule {}
