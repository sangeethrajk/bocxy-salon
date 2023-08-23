import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermsconditionPageRoutingModule } from './termscondition-routing.module';

import { TermsconditionPage } from './termscondition.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermsconditionPageRoutingModule
  ],
  declarations: [TermsconditionPage]
})
export class TermsconditionPageModule {}
