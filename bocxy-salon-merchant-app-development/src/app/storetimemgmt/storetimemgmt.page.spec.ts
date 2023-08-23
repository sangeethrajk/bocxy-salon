import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoretimemgmtPage } from './storetimemgmt.page';

describe('StoretimemgmtPage', () => {
  let component: StoretimemgmtPage;
  let fixture: ComponentFixture<StoretimemgmtPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoretimemgmtPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StoretimemgmtPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
