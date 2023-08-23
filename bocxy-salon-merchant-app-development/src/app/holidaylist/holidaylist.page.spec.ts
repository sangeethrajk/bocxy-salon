import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HolidaylistPage } from './holidaylist.page';

describe('HolidaylistPage', () => {
  let component: HolidaylistPage;
  let fixture: ComponentFixture<HolidaylistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidaylistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HolidaylistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
