import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookappointmentPage } from './bookappointment.page';

describe('BookappointmentPage', () => {
  let component: BookappointmentPage;
  let fixture: ComponentFixture<BookappointmentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookappointmentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookappointmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
