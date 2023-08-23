import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SlotdurationPage } from './slotduration.page';

const routes: Routes = [
  {
    path: '',
    component: SlotdurationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SlotdurationPageRoutingModule {}
