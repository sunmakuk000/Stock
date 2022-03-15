import { TestBed } from '@angular/core/testing';

import { CenterFnService } from './center-fn.service';

describe('CenterFnService', () => {
  let service: CenterFnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CenterFnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
