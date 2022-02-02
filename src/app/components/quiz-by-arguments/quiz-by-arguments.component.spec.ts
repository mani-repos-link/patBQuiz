import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizByArgumentsComponent } from './quiz-by-arguments.component';

describe('QuizByArgumentsComponent', () => {
  let component: QuizByArgumentsComponent;
  let fixture: ComponentFixture<QuizByArgumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizByArgumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizByArgumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
