import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecoveryoptionPage } from './recoveryoption.page';

describe('RecoveryoptionPage', () => {
  let component: RecoveryoptionPage;
  let fixture: ComponentFixture<RecoveryoptionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryoptionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecoveryoptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
