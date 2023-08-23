import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestservicePage } from './requestservice.page';

describe('RequestservicePage', () => {
  let component: RequestservicePage;
  let fixture: ComponentFixture<RequestservicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestservicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestservicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
