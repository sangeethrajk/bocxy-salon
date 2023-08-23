import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Ng2TelInputModule } from 'ng2-tel-input';

import { ForgotpwPageRoutingModule } from './forgotpw-routing.module';

import { ForgotpwPage } from './forgotpw.page';
import { ForgotPasswordService } from './forgotpw.service';
import { DirectivesModule } from '../_directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    Ng2TelInputModule,
    TranslateModule,
    ForgotpwPageRoutingModule,
    DirectivesModule
  ],
  declarations: [ForgotpwPage],
  providers: [ForgotPasswordService]
})
export class ForgotpwPageModule { }
