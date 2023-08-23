import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnswerquestionComponent } from './answerquestion.page';

const routes: Routes = [
  {
    path: '',
    component: AnswerquestionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnswerquestionPageRoutingModule {}
