import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StylistpermissionPage } from './stylistpermission.page';

describe('StylistpermissionPage', () => {
  let component: StylistpermissionPage;
  let fixture: ComponentFixture<StylistpermissionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StylistpermissionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StylistpermissionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
