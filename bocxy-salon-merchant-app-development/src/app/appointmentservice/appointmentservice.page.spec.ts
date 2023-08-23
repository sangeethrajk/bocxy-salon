import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppointmentServicePage } from './appointmentservice.page';

describe('AppointmentServicePage', () => {
  let component: AppointmentServicePage;
  let fixture: ComponentFixture<AppointmentServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentServicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
