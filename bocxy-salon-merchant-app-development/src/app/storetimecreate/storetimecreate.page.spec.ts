import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoretimecreatePage } from './storetimecreate.page';

describe('StoretimecreatePage', () => {
  let component: StoretimecreatePage;
  let fixture: ComponentFixture<StoretimecreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoretimecreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StoretimecreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
