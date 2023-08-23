import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpecialbookingPage } from './specialbooking.page';

describe('SpecialbookingPage', () => {
  let component: SpecialbookingPage;
  let fixture: ComponentFixture<SpecialbookingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialbookingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialbookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
