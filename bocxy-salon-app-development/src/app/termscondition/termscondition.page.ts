import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-termscondition',
  templateUrl: './termscondition.page.html',
  styleUrls: ['./termscondition.page.scss'],
})
export class TermsconditionPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }
  previous() {
    this.location.back();
  }

}
