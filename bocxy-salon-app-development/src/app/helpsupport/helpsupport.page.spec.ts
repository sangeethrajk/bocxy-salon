import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HelpsupportPage } from './helpsupport.page';

describe('HelpsupportPage', () => {
  let component: HelpsupportPage;
  let fixture: ComponentFixture<HelpsupportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpsupportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HelpsupportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
