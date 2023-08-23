import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoretimecreatePageRoutingModule } from './storetimecreate-routing.module';

import { StoretimecreatePage } from './storetimecreate.page';
import { SlotTimeCreateService } from './slottimecreate.service';
import { DirectivesModule } from '../_directives/directives.module';
import { DateService } from '../_services/date.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoretimecreatePageRoutingModule,
    ReactiveFormsModule,
    DirectivesModule
  ],
  declarations: [StoretimecreatePage],
  providers: [SlotTimeCreateService, DateService]
})
export class StoretimecreatePageModule { }
