import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatepwPageRoutingModule } from './createpw-routing.module';

import { CreatepwPage } from './createpw.page';
import { PasswordService } from './createpw.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatepwPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CreatepwPage],
  providers: [PasswordService]
})
export class CreatepwPageModule {}
