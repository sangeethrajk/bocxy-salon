import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnswerquestionPage } from './answerquestion.page';

describe('AnswerquestionPage', () => {
  let component: AnswerquestionPage;
  let fixture: ComponentFixture<AnswerquestionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerquestionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnswerquestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
