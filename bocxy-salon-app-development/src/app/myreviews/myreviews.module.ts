import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { IonicModule } from '@ionic/angular';
import { MyreviewsPageRoutingModule } from './myreviews-routing.module';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MyreviewsPage } from './myreviews.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxStarRatingModule, ReactiveFormsModule, FormsModule,
    MyreviewsPageRoutingModule
  ],
  declarations: [MyreviewsPage]
})
export class MyreviewsPageModule { }
