import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MystorehelpPage } from './mystorehelp.page';

describe('MystorehelpPage', () => {
  let component: MystorehelpPage;
  let fixture: ComponentFixture<MystorehelpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MystorehelpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MystorehelpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
