import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PermanentslotsPage } from './permanentslots.page';

describe('PermanentslotsPage', () => {
  let component: PermanentslotsPage;
  let fixture: ComponentFixture<PermanentslotsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermanentslotsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PermanentslotsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
