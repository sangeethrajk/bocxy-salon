import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { annoucementsServices } from './annoucements.service';
import { AnnouncementsPageRoutingModule } from './announcements-routing.module';

import { AnnouncementsPage } from './announcements.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AnnouncementsPageRoutingModule
  ],
  declarations: [AnnouncementsPage],
  providers: [
    annoucementsServices
  ]
})
export class AnnouncementsPageModule {}
