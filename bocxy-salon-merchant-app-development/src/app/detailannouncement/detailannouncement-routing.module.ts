import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailannouncementPage } from './detailannouncement.page';

const routes: Routes = [
  {
    path: '',
    component: DetailannouncementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailannouncementPageRoutingModule {}
