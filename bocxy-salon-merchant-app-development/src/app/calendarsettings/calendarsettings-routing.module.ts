import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarsettingsPage } from './calendarsettings.page';

const routes: Routes = [
  {
    path: '',
    component: CalendarsettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarsettingsPageRoutingModule {}
