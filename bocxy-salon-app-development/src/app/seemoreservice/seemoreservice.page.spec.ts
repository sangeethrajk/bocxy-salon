import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SeemoreservicePage } from './seemoreservice.page';

describe('SeemoreservicePage', () => {
  let component: SeemoreservicePage;
  let fixture: ComponentFixture<SeemoreservicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeemoreservicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SeemoreservicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
