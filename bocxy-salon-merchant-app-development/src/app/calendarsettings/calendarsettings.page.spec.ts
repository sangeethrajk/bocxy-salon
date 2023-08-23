import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CalendarsettingsPage } from './calendarsettings.page';

describe('CalendarsettingsPage', () => {
  let component: CalendarsettingsPage;
  let fixture: ComponentFixture<CalendarsettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarsettingsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarsettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
