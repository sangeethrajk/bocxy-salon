import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-shoplocation',
  templateUrl: './shoplocation.page.html',
  styleUrls: ['./shoplocation.page.scss'],
})
export class ShoplocationPage implements OnInit {

  constructor(private _location: Location) { }

  // Declare the variable (in this case and initialize it with false)
  isPlaceAvailable = false;
  places = [];

  initializeItems() {
    this.places = ["Avadi", "Ambattur", "Ayanavaram", "Padi", "Villivakkam", "Mugapair"];
  }

  getPlaces(ev: any) {
    this.initializeItems();

    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.isPlaceAvailable = true;
      this.places = this.places.filter((place) => {
        return (place.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.isPlaceAvailable = false;
    }
  }

  ngOnInit() {
  }

  previous() {
    this._location.back();
  }

}
