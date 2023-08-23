import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdatepwPageRoutingModule } from './updatepw-routing.module';
import { UpdatePasswordService } from './updatepw.service';

import { UpdatepwComponent } from './updatepw.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UpdatepwPageRoutingModule
  ],
  declarations: [UpdatepwComponent],
  providers: [
    UpdatePasswordService
  ]
})
export class UpdatepwPageModule { }
