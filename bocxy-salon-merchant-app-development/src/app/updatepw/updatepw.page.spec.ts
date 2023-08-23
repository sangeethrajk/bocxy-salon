import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdatepwPage } from './updatepw.page';

describe('UpdatepwPage', () => {
  let component: UpdatepwPage;
  let fixture: ComponentFixture<UpdatepwPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatepwPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatepwPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
