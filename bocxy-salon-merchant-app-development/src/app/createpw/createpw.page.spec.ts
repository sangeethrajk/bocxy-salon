import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreatepwPage } from './createpw.page';

describe('CreatepwPage', () => {
  let component: CreatepwPage;
  let fixture: ComponentFixture<CreatepwPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatepwPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatepwPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
