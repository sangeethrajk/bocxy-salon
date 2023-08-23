import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { IonicModule } from '@ionic/angular';

import { ChangepasswordPageRoutingModule } from './changepassword-routing.module';

import { ChangepasswordPage } from './changepassword.page';
import { DateService } from '../_services/date.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ChangepasswordPageRoutingModule,
    NgOtpInputModule
  ],
  declarations: [ChangepasswordPage],
  providers: [DateService]
})
export class ChangepasswordPageModule {}
