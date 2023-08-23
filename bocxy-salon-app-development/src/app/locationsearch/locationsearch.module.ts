import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationsearchRoutingModule } from './locationsearch-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LocationsearchComponent } from './locationsearch.component';

@NgModule({
  imports: [
    CommonModule,
    LocationsearchRoutingModule,
    FormsModule,
    IonicModule
  ],
  declarations: [LocationsearchComponent]
})
export class LocationsearchModule { }
