import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecoveryoptionPageRoutingModule } from './recoveryoption-routing.module';

import { RecoveryoptionPage } from './recoveryoption.page';
import { ForgotPasswordService } from '../forgotpw/forgotpw.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecoveryoptionPageRoutingModule
  ],
  declarations: [RecoveryoptionPage],
  providers: [ForgotPasswordService]
})
export class RecoveryoptionPageModule { }
