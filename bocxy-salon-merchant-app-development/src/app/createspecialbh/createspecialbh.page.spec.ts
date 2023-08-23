import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreatespecialbhPage } from './createspecialbh.page';

describe('CreatespecialbhPage', () => {
  let component: CreatespecialbhPage;
  let fixture: ComponentFixture<CreatespecialbhPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatespecialbhPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatespecialbhPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
