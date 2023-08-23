import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

import { IonicModule } from '@ionic/angular';

import { AddservicesPageRoutingModule } from './addservices-routing.module';

import { AddservicesPage } from './addservices.page';
import { AddServiceService } from './addservices.service';
import { DateService } from '../_services/date.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AutocompleteLibModule,
    AddservicesPageRoutingModule
  ],
  declarations: [AddservicesPage],
  providers: [
    AddServiceService,
    DateService,
    Camera
  ]
})
export class AddservicesPageModule { }
