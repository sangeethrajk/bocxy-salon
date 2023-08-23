import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-helpsupport',
  templateUrl: './helpsupport.page.html',
  styleUrls: ['./helpsupport.page.scss'],
})
export class HelpsupportPage implements OnInit {

  constructor(private location: Location,
    public translate: TranslateService,
    public TranslateModule: TranslateModule) { }

  ngOnInit() {
  }

  previous() {
    this.location.back();
  }
}
