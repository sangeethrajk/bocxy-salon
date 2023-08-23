import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FindstorePage } from './findstore.page';

describe('FindstorePage', () => {
  let component: FindstorePage;
  let fixture: ComponentFixture<FindstorePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindstorePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FindstorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
