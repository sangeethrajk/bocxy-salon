import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormenPage } from './formen.page';

describe('FormenPage', () => {
  let component: FormenPage;
  let fixture: ComponentFixture<FormenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
