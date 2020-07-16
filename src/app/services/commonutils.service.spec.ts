import { TestBed } from '@angular/core/testing';

import { CommonutilsService } from './commonutils.service';

describe('CommonutilsService', () => {
  let service: CommonutilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonutilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
