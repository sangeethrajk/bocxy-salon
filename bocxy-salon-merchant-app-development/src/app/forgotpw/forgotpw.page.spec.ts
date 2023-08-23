import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ForgotpwPage } from './forgotpw.page';

describe('ForgotpwPage', () => {
  let component: ForgotpwPage;
  let fixture: ComponentFixture<ForgotpwPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotpwPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotpwPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
