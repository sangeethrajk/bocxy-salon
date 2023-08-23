import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentmodePage } from './paymentmode.page';

describe('PaymentmodePage', () => {
  let component: PaymentmodePage;
  let fixture: ComponentFixture<PaymentmodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentmodePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentmodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
