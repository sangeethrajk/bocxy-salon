import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SlotdurationPage } from './slotduration.page';

describe('SlotdurationPage', () => {
  let component: SlotdurationPage;
  let fixture: ComponentFixture<SlotdurationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlotdurationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SlotdurationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
