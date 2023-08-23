import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordService } from './forgotpw.service';
import { IonicModule } from '@ionic/angular';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { NgOtpInputModule } from 'ng-otp-input';
import { ForgotpwPageRoutingModule } from './forgotpw-routing.module';
import { DateService } from '../_services/date.service';
import { ForgotpwPage } from './forgotpw.page';
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
    ForgotpwPageRoutingModule,
    DirectivesModule,
    TranslateModule
  ],
  declarations: [ForgotpwPage],
  providers: [ForgotPasswordService,
    DateService]
})
export class ForgotpwPageModule { }
