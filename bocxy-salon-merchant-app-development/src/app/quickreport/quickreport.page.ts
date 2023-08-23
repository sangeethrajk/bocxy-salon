import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-quickreport',
  templateUrl: './quickreport.page.html',
  styleUrls: ['./quickreport.page.scss'],
})
export class QuickreportPage implements OnInit {

  constructor(private _location: Location) { }

  expenses = [
    { title: "Revenue of the month", item: "1,15000", icon: "trending-up-outline", color: "success" },
    { title: "Rental", item: "12,000", icon: "trending-down-outline", color: "danger" },
    { title: "Electricity", item: "8,000", icon: "trending-down-outline", color: "danger" },
    { title: "Cosmetics", item: "40,000", icon: "trending-down-outline", color: "danger" },
    { title: "Profit", item: "55,000", icon: "cash-outline", color: "warning" }
  ];

  ngOnInit() {
  }
  previous() {
    this._location.back();
  }
}
