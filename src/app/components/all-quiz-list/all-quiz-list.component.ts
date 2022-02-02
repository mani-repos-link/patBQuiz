import { Component, OnInit } from '@angular/core';
import {MultiLingualQuizService, QuizData, QuizQuestion} from "../../services/multi-lingual-quiz.service";
import {TrickWordsListService} from "../../services/trick-words-list.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-all-quiz-list',
  templateUrl: './all-quiz-list.component.html',
  styleUrls: ['./all-quiz-list.component.scss']
})
export class AllQuizListComponent implements OnInit {

  quizData: QuizData | undefined;
  intervalRange: { start: number; end: number; currentQuestion: number; } | undefined;
  quizList: QuizQuestion[] = [];
  quizViewList: QuizQuestion[] = [];

  constructor(private quizSvc: MultiLingualQuizService,
              private twlSvc: TrickWordsListService,
              private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.fetchQuizData();
  }

  private fetchQuizData() {
    this.quizSvc.getQuizData().subscribe((qd) => {
      this.quizData = qd;
      this.listenToQuizData();
      this.loadQuizQuestions();
    });
  }

  private listenToQuizData() {
    this.quizData?.quizzes.subscribe((quizList: QuizQuestion[]) => {
      this.quizList = quizList;
      this.loadQuizQuestions();
    });
  }

  onQuizViewIntervalChange(intervalRange: any) {
    this.intervalRange = intervalRange;
    this.loadQuizQuestions();
  }

  private loadQuizQuestions(): void {
    if (this.intervalRange == null || this.quizList == null || this.quizList?.length == 0) {
      return;
    }
    this.quizViewList = this.quizList.slice(this.intervalRange.start, this.intervalRange.end);
  }

}
