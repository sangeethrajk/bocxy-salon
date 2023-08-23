import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";

@Component({
  selector: 'app-detailannouncement',
  templateUrl: './detailannouncement.page.html',
  styleUrls: ['./detailannouncement.page.scss'],
})
export class DetailannouncementPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  previous() {
    this.location.back();
  }
}
