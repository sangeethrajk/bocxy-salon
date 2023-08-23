import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateregularbhPage } from './createregularbh.page';

describe('CreateregularbhPage', () => {
  let component: CreateregularbhPage;
  let fixture: ComponentFixture<CreateregularbhPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateregularbhPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateregularbhPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
