import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GrademgmtPage } from './grademgmt.page';

describe('GrademgmtPage', () => {
  let component: GrademgmtPage;
  let fixture: ComponentFixture<GrademgmtPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrademgmtPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GrademgmtPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
