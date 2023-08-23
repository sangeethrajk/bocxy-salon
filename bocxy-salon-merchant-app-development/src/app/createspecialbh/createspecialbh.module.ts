import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatespecialbhPageRoutingModule } from './createspecialbh-routing.module';

import { CreatespecialbhPage } from './createspecialbh.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatespecialbhPageRoutingModule
  ],
  declarations: [CreatespecialbhPage]
})
export class CreatespecialbhPageModule { }
