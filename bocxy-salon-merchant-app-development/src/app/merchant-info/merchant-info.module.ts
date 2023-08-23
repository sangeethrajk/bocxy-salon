import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MerchantInfoPageRoutingModule } from './merchant-info-routing.module';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { MerchantInfoService } from './merchant-info.service';
import { TranslateModule } from '@ngx-translate/core';

import { MerchantInfoPage } from './merchant-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    Ng2TelInputModule,
    TranslateModule,
    MerchantInfoPageRoutingModule
  ],
  declarations: [MerchantInfoPage],
  providers: [
    MerchantInfoService
  ]
})
export class MerchantInfoPageModule { }
