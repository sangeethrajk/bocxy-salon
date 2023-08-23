import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaylaterPage } from './paylater.page';

describe('PaylaterPage', () => {
  let component: PaylaterPage;
  let fixture: ComponentFixture<PaylaterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaylaterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaylaterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
