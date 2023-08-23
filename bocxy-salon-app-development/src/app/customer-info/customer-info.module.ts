import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { CustomerInfoPageRoutingModule } from './customer-info-routing.module';
import { CustomerInfoService } from './customer-info.service';
import { CustomerInfoPage } from './customer-info.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerInfoPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    Ng2TelInputModule
  ],
  declarations: [CustomerInfoPage],
  providers: [CustomerInfoService]
})
export class CustomerInfoPageModule { }
