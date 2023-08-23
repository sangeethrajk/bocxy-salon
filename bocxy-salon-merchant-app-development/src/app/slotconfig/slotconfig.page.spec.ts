import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SlotconfigPage } from './slotconfig.page';

describe('SlotconfigPage', () => {
  let component: SlotconfigPage;
  let fixture: ComponentFixture<SlotconfigPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlotconfigPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SlotconfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
