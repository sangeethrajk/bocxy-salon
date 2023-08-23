import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DefaultservicetimePageRoutingModule } from './defaultservicetime-routing.module';

import { DefaultservicetimePage } from './defaultservicetime.page';
import { StoreDefaultSlotsServices } from './defaultservices.service';
import { DirectivesModule } from '../_directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DefaultservicetimePageRoutingModule,
    DirectivesModule
  ],
  declarations: [DefaultservicetimePage],
  providers: [StoreDefaultSlotsServices]
})
export class DefaultservicetimePageModule { }
