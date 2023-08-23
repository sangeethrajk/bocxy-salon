import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StylistmgmtPage } from './stylistmgmt.page';

describe('StylistmgmtPage', () => {
  let component: StylistmgmtPage;
  let fixture: ComponentFixture<StylistmgmtPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StylistmgmtPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StylistmgmtPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
