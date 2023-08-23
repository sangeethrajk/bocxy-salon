import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { NgOtpInputModule } from 'ng-otp-input';

import { LoginPageRoutingModule } from './login-routing.module';
import { FcmService } from '../_services/fcm.service';
import { LoginPage } from './login.page';
import { DirectivesModule } from '../_directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    Ng2TelInputModule,
    NgOtpInputModule,
    LoginPageRoutingModule,
    TranslateModule,
    DirectivesModule
  ],
  declarations: [LoginPage],
  providers: [FcmService]
})
export class LoginPageModule { }
