import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DefaultservicetimePage } from './defaultservicetime.page';

describe('DefaultservicetimePage', () => {
  let component: DefaultservicetimePage;
  let fixture: ComponentFixture<DefaultservicetimePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultservicetimePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultservicetimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
