import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreategradePageRoutingModule } from './creategrade-routing.module';

import { CreategradePage } from './creategrade.page';
import { DirectivesModule } from '../_directives/directives.module';
import { GradeService } from './creategrade.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreategradePageRoutingModule,
    ReactiveFormsModule,
    DirectivesModule
  ],
  declarations: [CreategradePage],
  providers: [GradeService]
})
export class CreategradePageModule { }
