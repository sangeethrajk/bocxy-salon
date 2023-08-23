import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsermanualPage } from './usermanual.page';

describe('UsermanualPage', () => {
  let component: UsermanualPage;
  let fixture: ComponentFixture<UsermanualPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsermanualPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsermanualPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
