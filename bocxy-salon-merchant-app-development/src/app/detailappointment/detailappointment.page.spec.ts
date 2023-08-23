import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailappointmentPage } from './detailappointment.page';

describe('DetailappointmentPage', () => {
  let component: DetailappointmentPage;
  let fixture: ComponentFixture<DetailappointmentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailappointmentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailappointmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
