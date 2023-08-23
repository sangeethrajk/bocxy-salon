import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpecialslotsPage } from './specialslots.page';

describe('SpecialslotsPage', () => {
  let component: SpecialslotsPage;
  let fixture: ComponentFixture<SpecialslotsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialslotsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialslotsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
