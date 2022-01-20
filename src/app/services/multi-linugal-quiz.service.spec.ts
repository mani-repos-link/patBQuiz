import { TestBed } from '@angular/core/testing';

import { MultiLingualQuizService } from './multi-lingual-quiz.service';

describe('MultiLinugalQuizService', () => {
  let service: MultiLingualQuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiLingualQuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
