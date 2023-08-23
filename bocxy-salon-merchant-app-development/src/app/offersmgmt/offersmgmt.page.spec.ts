import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OffersmgmtPage } from './offersmgmt.page';

describe('OffersmgmtPage', () => {
  let component: OffersmgmtPage;
  let fixture: ComponentFixture<OffersmgmtPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffersmgmtPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OffersmgmtPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
