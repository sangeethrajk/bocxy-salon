import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddstylistPage } from './addstylist.page';

describe('AddstylistPage', () => {
  let component: AddstylistPage;
  let fixture: ComponentFixture<AddstylistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddstylistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddstylistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
