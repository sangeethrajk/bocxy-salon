import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailannouncementPage } from './detailannouncement.page';

describe('DetailannouncementPage', () => {
  let component: DetailannouncementPage;
  let fixture: ComponentFixture<DetailannouncementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailannouncementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailannouncementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
