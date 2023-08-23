import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-specialbhhistory',
  templateUrl: './specialbhhistory.page.html',
  styleUrls: ['./specialbhhistory.page.scss'],
})
export class SpecialbhhistoryPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }
  previous() {
    this.location.back();
  }
}
