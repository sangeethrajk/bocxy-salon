import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';
import { FcmService } from '../_services/fcm.service';
import { LoginPage } from './login.page';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { DirectivesModule } from '../_directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    Ng2TelInputModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    LoginPageRoutingModule,
    DirectivesModule
  ],
  declarations: [LoginPage],
  providers: [FcmService]
})
export class LoginPageModule { }
