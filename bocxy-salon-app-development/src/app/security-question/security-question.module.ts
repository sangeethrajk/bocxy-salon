import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SecurityQuestionPageRoutingModule } from './security-question-routing.module';
import { SecurityQuestionService } from './security-question.service';
import { SecurityQuestionPage } from './security-question.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SecurityQuestionPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SecurityQuestionPage],
  providers: [SecurityQuestionService]
})
export class SecurityQuestionPageModule {}
