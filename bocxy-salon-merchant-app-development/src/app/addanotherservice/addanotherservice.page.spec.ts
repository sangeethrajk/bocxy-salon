import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddanotherservicePage } from './addanotherservice.page';

describe('AddanotherservicePage', () => {
  let component: AddanotherservicePage;
  let fixture: ComponentFixture<AddanotherservicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddanotherservicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddanotherservicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
