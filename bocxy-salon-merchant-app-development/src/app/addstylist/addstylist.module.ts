import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddstylistPageRoutingModule } from './addstylist-routing.module';

import { AddstylistPage } from './addstylist.page';
import { AddStylistService } from './addstylist.service';
import { DirectivesModule } from '../_directives/directives.module';
import { Ng2TelInputModule } from 'ng2-tel-input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddstylistPageRoutingModule,
    DirectivesModule,
    Ng2TelInputModule,
  ],
  declarations: [AddstylistPage],
  providers: [
    AddStylistService
  ]
})
export class AddstylistPageModule { }
