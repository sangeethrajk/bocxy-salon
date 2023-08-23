import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StylistProfieCompletePage } from './stylist-profile-complete.page';

describe('MerchantInfoPage', () => {
  let component: StylistProfieCompletePage;
  let fixture: ComponentFixture<StylistProfieCompletePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StylistProfieCompletePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StylistProfieCompletePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
