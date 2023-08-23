import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShoplocationPage } from './shoplocation.page';

describe('ShoplocationPage', () => {
  let component: ShoplocationPage;
  let fixture: ComponentFixture<ShoplocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoplocationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShoplocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
