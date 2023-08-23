import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailannouncementPageRoutingModule } from './detailannouncement-routing.module';

import { DetailannouncementPage } from './detailannouncement.page';
import { detailAnnoucementService } from './detailannouncement.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailannouncementPageRoutingModule
  ],
  declarations: [DetailannouncementPage],
  providers: [detailAnnoucementService]
})
export class DetailannouncementPageModule { }
