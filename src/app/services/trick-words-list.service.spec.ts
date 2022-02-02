import { TestBed } from '@angular/core/testing';

import { TrickWordsListService } from './trick-words-list.service';

describe('TrickWordsListService', () => {
  let service: TrickWordsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrickWordsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
