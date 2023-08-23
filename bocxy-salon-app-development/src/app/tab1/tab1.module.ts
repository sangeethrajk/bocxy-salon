import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CustomerNotificationService } from '../notifications/notfications.service';
import { IonicModule } from '@ionic/angular';

import { Tab1PageRoutingModule } from './tab1-routing.module';

import { Tab1Page } from './tab1.page';

import { FindStoreService } from '../findstore/findstore.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FontAwesomeModule,
    TranslateModule,
    Tab1PageRoutingModule
  ],
  declarations: [Tab1Page],
  providers: [FindStoreService, CustomerNotificationService]
})
export class Tab1PageModule { }
