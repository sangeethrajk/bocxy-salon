import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TermsconditionPage } from './termscondition.page';

describe('TermsconditionPage', () => {
  let component: TermsconditionPage;
  let fixture: ComponentFixture<TermsconditionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsconditionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TermsconditionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
