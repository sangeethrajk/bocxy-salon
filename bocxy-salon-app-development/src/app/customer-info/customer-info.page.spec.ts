import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomerInfoPage } from './customer-info.page';

describe('MerchantInfoPage', () => {
  let component: CustomerInfoPage;
  let fixture: ComponentFixture<CustomerInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerInfoPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
