import { TestBed } from '@angular/core/testing';

import { StylistPermissionService } from './stylist-permission.service';

describe('StylistPermissionService', () => {
  let service: StylistPermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StylistPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
