import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecoveryotpPage } from './recoveryotp.page';

describe('RecoveryotpPage', () => {
  let component: RecoveryotpPage;
  let fixture: ComponentFixture<RecoveryotpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryotpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecoveryotpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
