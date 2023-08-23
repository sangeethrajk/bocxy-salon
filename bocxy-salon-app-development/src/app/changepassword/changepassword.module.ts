import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangepasswordPageRoutingModule } from './changepassword-routing.module';

import { ChangepasswordPage } from './changepassword.page';
import { NgOtpInputModule } from 'ng-otp-input';
import { DateService } from '../_services/date.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ChangepasswordPageRoutingModule,
    TranslateModule,
    NgOtpInputModule
  ],
  declarations: [ChangepasswordPage],
  providers: [DateService]
})
export class ChangepasswordPageModule { }
