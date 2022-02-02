import { TestBed } from '@angular/core/testing';

import { InitSpinnerService } from './init-spinner.service';

describe('InitSpinnerService', () => {
  let service: InitSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitSpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
