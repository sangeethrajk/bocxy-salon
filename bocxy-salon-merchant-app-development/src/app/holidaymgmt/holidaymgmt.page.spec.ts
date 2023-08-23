import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HolidaymgmtPage } from './holidaymgmt.page';

describe('HolidaymgmtPage', () => {
  let component: HolidaymgmtPage;
  let fixture: ComponentFixture<HolidaymgmtPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidaymgmtPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HolidaymgmtPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
