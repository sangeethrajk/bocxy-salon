import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoretimemgmtPageRoutingModule } from './storetimemgmt-routing.module';

import { StoretimemgmtPage } from './storetimemgmt.page';
import { StoreTimeManagementService } from './storetimemgmt.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoretimemgmtPageRoutingModule
  ],
  declarations: [StoretimemgmtPage],
  providers: [StoreTimeManagementService]
})
export class StoretimemgmtPageModule { }
