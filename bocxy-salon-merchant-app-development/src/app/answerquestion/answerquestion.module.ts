import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { AnswerquestionPageRoutingModule } from './answerquestion-routing.module';

import { AnswerquestionPage } from './answerquestion.page';
import { ForgotPasswordService } from '../forgotpw/forgotpw.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    AnswerquestionPageRoutingModule
  ],
  declarations: [AnswerquestionPage],
  providers: [ForgotPasswordService]
})
export class AnswerquestionPageModule { }
