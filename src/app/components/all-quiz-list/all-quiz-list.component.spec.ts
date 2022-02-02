import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllQuizListComponent } from './all-quiz-list.component';

describe('AllQuizListComponent', () => {
  let component: AllQuizListComponent;
  let fixture: ComponentFixture<AllQuizListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllQuizListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllQuizListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
