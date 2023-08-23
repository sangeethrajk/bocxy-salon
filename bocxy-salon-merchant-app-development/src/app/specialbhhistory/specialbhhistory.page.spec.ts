import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpecialbhhistoryPage } from './specialbhhistory.page';

describe('SpecialbhhistoryPage', () => {
  let component: SpecialbhhistoryPage;
  let fixture: ComponentFixture<SpecialbhhistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialbhhistoryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialbhhistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
