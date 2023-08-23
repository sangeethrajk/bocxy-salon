import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreatepwPageRoutingModule } from './createpw-routing.module';
import { PasswordService } from './create-passoword.service';
import { TranslateModule } from '@ngx-translate/core';

import { CreatepwPage } from './createpw.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    CreatepwPageRoutingModule
  ],
  declarations: [CreatepwPage],
  providers: [
    PasswordService
  ]
})
export class CreatepwPageModule { }
