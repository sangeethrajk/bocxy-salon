import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewServicedetailPage } from './view-servicedetail.page';

describe('ViewServicedetailPage', () => {
  let component: ViewServicedetailPage;
  let fixture: ComponentFixture<ViewServicedetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewServicedetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewServicedetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
