import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LocationsearchComponent } from './locationsearch.component';

const routes: Routes = [
  {
    path: '',
    component: LocationsearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class LocationsearchRoutingModule { }
