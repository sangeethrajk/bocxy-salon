import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnswerquestionPage } from './answerquestion.page';

const routes: Routes = [
  {
    path: '',
    component: AnswerquestionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnswerquestionPageRoutingModule {}
