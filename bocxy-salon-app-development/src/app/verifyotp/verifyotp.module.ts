import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyotpComponent } from './verifyotp.page';
import { VerifyOtpComponentRoutingModule } from './verifyotp-routing.module';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { NgOtpInputModule } from 'ng-otp-input';
import { SignupService } from '../signup/signup.service';
import { DateService } from '../_services/date.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    Ng2TelInputModule,
    NgOtpInputModule,
    VerifyOtpComponentRoutingModule
  ],
  declarations: [VerifyotpComponent],
  providers: [SignupService, DateService]
})
export class VerifyOtpComponentModule { }
