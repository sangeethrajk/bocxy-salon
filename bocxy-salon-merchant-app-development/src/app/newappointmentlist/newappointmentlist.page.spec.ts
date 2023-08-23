import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewAppointmentlistPage } from './newappointmentlist.page';

describe('AppointmentlistPage', () => {
  let component: NewAppointmentlistPage;
  let fixture: ComponentFixture<NewAppointmentlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAppointmentlistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewAppointmentlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
