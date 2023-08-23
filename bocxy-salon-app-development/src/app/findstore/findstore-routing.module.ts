import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FindstorePage } from './findstore.page';

const routes: Routes = [
  {
    path: '',
    component: FindstorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FindstorePageRoutingModule {}
