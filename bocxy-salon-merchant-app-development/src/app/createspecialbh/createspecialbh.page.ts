import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-createspecialbh',
  templateUrl: './createspecialbh.page.html',
  styleUrls: ['./createspecialbh.page.scss'],
})
export class CreatespecialbhPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }
  previous() {
    this.location.back();
  }

}
