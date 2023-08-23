import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QuickreportPage } from './quickreport.page';

describe('QuickreportPage', () => {
  let component: QuickreportPage;
  let fixture: ComponentFixture<QuickreportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickreportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QuickreportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
