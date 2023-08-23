import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GlobalsearchPageRoutingModule } from './globalsearch-routing.module';

import { GlobalsearchPage } from './globalsearch.page';
import { GlobalSearchService } from './globalsearch.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    GlobalsearchPageRoutingModule
  ],
  declarations: [GlobalsearchPage],
  providers: [GlobalSearchService]
})
export class GlobalsearchPageModule { }
