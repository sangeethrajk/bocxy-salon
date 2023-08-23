import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StylistProfieCompletePageRoutingModule } from './stylist-profile-complete-routing.module';
import { StylistProfieCompleteService } from './stylist-profile-complete.service';

import { StylistProfieCompletePage } from './stylist-profile-complete.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    StylistProfieCompletePageRoutingModule
  ],
  declarations: [StylistProfieCompletePage],
  providers: [
    StylistProfieCompleteService
  ]
})
export class StylistProfieCompletePageModule { }
