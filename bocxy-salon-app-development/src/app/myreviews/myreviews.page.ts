import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-myreviews',
  templateUrl: './myreviews.page.html',
  styleUrls: ['./myreviews.page.scss'],
})
export class MyreviewsPage implements OnInit {
  rating3: number;
  public form: FormGroup;

  constructor(private location: Location, private fb: FormBuilder) {
    this.rating3 = 0;
    this.form = this.fb.group({
      rating1: ['', Validators.required],
      rating2: [4]
    });

  }

  ngOnInit() {
  }

  previous() {
    this.location.back();
  }
}
