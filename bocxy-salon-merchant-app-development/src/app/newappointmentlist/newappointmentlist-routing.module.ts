import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewAppointmentlistPage } from './newappointmentlist.page';

const routes: Routes = [
  {
    path: '',
    component: NewAppointmentlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewAppointmentlistPageRoutingModule {}
