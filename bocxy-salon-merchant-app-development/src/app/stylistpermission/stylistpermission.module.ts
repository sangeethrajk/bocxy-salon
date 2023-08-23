import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StylistpermissionPageRoutingModule } from './stylistpermission-routing.module';

import { StylistpermissionPage } from './stylistpermission.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StylistpermissionPageRoutingModule
  ],
  declarations: [StylistpermissionPage]
})
export class StylistpermissionPageModule {}
