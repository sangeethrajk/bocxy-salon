import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SecurityQuestionService } from './security-question.service';

import { SecurityQuestionPageRoutingModule } from './security-question-routing.module';

import { SecurityQuestionPage } from './security-question.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    SecurityQuestionPageRoutingModule
  ],
  declarations: [SecurityQuestionPage],
  providers: [
    SecurityQuestionService
  ]
})
export class SecurityQuestionPageModule { }
