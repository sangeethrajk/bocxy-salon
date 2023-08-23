import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddservicesPage } from './addservices.page';

describe('AddservicesPage', () => {
  let component: AddservicesPage;
  let fixture: ComponentFixture<AddservicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddservicesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddservicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
