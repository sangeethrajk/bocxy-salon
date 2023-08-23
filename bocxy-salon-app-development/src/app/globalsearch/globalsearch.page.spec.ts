import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GlobalsearchPage } from './globalsearch.page';

describe('GlobalsearchPage', () => {
  let component: GlobalsearchPage;
  let fixture: ComponentFixture<GlobalsearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalsearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalsearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
