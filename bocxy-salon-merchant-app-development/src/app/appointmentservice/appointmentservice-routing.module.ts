import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppointmentServicePage } from './appointmentservice.page';

const routes: Routes = [
  {
    path: '',
    component: AppointmentServicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentServicePageRoutingModule {}
