import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-requestservice',
  templateUrl: './requestservice.page.html',
  styleUrls: ['./requestservice.page.scss'],
})
export class RequestservicePage implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit() {
  }
  previous() {
    this._location.back();
  }

}
