import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SeealltreatmentPage } from './seealltreatment.page';

describe('SeealltreatmentPage', () => {
  let component: SeealltreatmentPage;
  let fixture: ComponentFixture<SeealltreatmentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeealltreatmentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SeealltreatmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
