import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup';
import { SignupComponentRoutingModule } from './signup-routing.module';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { NgOtpInputModule } from 'ng-otp-input';
import { SignupService } from './signup.service';
import { DirectivesModule } from '../_directives/directives.module';
import { DateService } from '../_services/date.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    Ng2TelInputModule,
    NgOtpInputModule,
    TranslateModule,
    SignupComponentRoutingModule,
    DirectivesModule
  ],
  declarations: [SignupComponent],
  providers: [
    SignupService,
    DateService
  ]
})
export class SignupComponentModule { }
