import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FindstorePageRoutingModule } from './findstore-routing.module';

import { FindstorePage } from './findstore.page';
import { FindStoreService } from './findstore.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    FindstorePageRoutingModule
  ],
  declarations: [FindstorePage],
  providers: [FindStoreService]
})
export class FindstorePageModule { }
