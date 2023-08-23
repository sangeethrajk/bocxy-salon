import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalkincustomersPage } from './walkincustomers.page';

describe('WalkincustomersPage', () => {
  let component: WalkincustomersPage;
  let fixture: ComponentFixture<WalkincustomersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalkincustomersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WalkincustomersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
