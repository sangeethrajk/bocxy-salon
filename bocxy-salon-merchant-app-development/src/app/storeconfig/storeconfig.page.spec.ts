import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoreconfigPage } from './storeconfig.page';

describe('StoreconfigPage', () => {
  let component: StoreconfigPage;
  let fixture: ComponentFixture<StoreconfigPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreconfigPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StoreconfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
