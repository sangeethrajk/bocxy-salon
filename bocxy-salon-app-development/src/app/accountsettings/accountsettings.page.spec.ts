import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccountsettingsPage } from './accountsettings.page';

describe('AccountsettingsPage', () => {
  let component: AccountsettingsPage;
  let fixture: ComponentFixture<AccountsettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsettingsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountsettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
