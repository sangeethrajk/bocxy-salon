import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { IonicModule } from '@ionic/angular';

import { FormenPageRoutingModule } from './formen-routing.module';

import { FormenPage } from './formen.page';
import { AllServices } from './allServices.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormenPageRoutingModule,
    TranslateModule,
    FontAwesomeModule
  ],
  declarations: [FormenPage],
  providers: [AllServices]
})
export class FormenPageModule { }
