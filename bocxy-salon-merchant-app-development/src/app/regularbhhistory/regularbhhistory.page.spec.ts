import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegularbhhistoryPage } from './regularbhhistory.page';

describe('RegularbhhistoryPage', () => {
  let component: RegularbhhistoryPage;
  let fixture: ComponentFixture<RegularbhhistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegularbhhistoryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegularbhhistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
