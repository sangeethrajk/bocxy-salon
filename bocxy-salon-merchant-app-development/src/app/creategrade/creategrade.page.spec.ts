import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreategradePage } from './creategrade.page';

describe('CreategradePage', () => {
  let component: CreategradePage;
  let fixture: ComponentFixture<CreategradePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreategradePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreategradePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
