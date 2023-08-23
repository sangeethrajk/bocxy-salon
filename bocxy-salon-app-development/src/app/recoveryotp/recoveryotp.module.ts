import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { IonicModule } from '@ionic/angular';

import { RecoveryotpPageRoutingModule } from './recoveryotp-routing.module';

import { RecoveryotpComponent } from './recoveryotp.page';
import { ForgotPasswordService } from '../forgotpw/forgotpw.service';
import { DateService } from '../_services/date.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NgOtpInputModule,
    RecoveryotpPageRoutingModule
  ],
  declarations: [RecoveryotpComponent],
  providers: [
    ForgotPasswordService,
    DateService
  ]
})
export class RecoveryotpPageModule { }
