import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MultiLingualQuizService, QuizData, QuizQuestion} from "../../services/multi-lingual-quiz.service";
import {TrickWordsListService} from "../../services/trick-words-list.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";

@Component({
  selector: 'app-all-quiz-list',
  templateUrl: './all-quiz-list.component.html',
  styleUrls: ['./all-quiz-list.component.scss']
})
export class AllQuizListComponent implements OnInit {

  @ViewChild('allQuizContainer', {static: true, read: ElementRef})
  allQuizContainer!: ElementRef
  @ViewChild('cdkVirtualScrollViewport')
  private cdkVirtualScrollViewport!: CdkVirtualScrollViewport;
  @ViewChild('cdkVirtualScrollViewport', {static: true})
  private cdkVirtualScrollViewportDOM!: ElementRef;
  quizData: QuizData | undefined;
  intervalRange: { start: number; end: number; currentQuestion?: number; } | undefined;
  quizList: QuizQuestion[] = [];
  quizViewList: QuizQuestion[] = [];

  get quizContainerHeight() {
    let h = (this.allQuizContainer.nativeElement?.offsetHeight - 100);
    if (h == null || h < 100) {
      h = 300; // minimum height;
    }
    return h;
  }

  constructor(
    private quizSvc: MultiLingualQuizService,
    private twlSvc: TrickWordsListService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.fetchQuizData();
  }

  private fetchQuizData() {
    this.quizSvc.getQuizData().subscribe((qd: QuizData) => {
      this.intervalRange = { start: 0, end: qd.quizzes.getValue().length, currentQuestion: 0, };
      this.quizData = qd;
      this.quizViewList = qd.quizzes.getValue();
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
