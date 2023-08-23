import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GrademgmtPageRoutingModule } from './grademgmt-routing.module';

import { GrademgmtPage } from './grademgmt.page';
import { GradeMgmtService } from './grademgmt.service';
import {GradeService} from '../creategrade/creategrade.service';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GrademgmtPageRoutingModule
  ],
  declarations: [GrademgmtPage],
  providers:[GradeMgmtService, GradeService]
})
export class GrademgmtPageModule {}
