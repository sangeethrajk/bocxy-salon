import { TestBed } from '@angular/core/testing';

import { HardbackService } from './hardback.service';

describe('HardbackService', () => {
  let service: HardbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HardbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
