import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StylistmgmtPageRoutingModule } from './stylistmgmt-routing.module';

import { StylistmgmtPage } from './stylistmgmt.page';
import { StylistManagementService } from './stylistmgmt.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StylistmgmtPageRoutingModule
  ],
  declarations: [StylistmgmtPage],
  providers: [StylistManagementService]
})
export class StylistmgmtPageModule { }
