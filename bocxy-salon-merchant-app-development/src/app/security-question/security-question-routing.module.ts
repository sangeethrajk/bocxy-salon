import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecurityQuestionPage } from './security-question.page';

const routes: Routes = [
  {
    path: '',
    component: SecurityQuestionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecurityQuestionPageRoutingModule {}
