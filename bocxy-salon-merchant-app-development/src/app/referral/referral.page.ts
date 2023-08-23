import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.page.html',
  styleUrls: ['./referral.page.scss'],
})
export class ReferralPage implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit() {
  }
  previous() {
    this._location.back();
  }

}
