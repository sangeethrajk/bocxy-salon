import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailappointmentPage } from './detailappointment.page';

const routes: Routes = [
  {
    path: '',
    component: DetailappointmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailappointmentPageRoutingModule {}
