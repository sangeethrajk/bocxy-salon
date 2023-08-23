import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppointmentlistPage } from './appointmentlist.page';

const routes: Routes = [
  {
    path: '',
    component: AppointmentlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentlistPageRoutingModule {}
