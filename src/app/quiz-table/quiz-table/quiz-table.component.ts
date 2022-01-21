import {Component, Input, OnInit} from '@angular/core';
import {MultiLingualQuizService, QuizQuestion} from "../../services/multi-lingual-quiz.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-quiz-table',
  templateUrl: './quiz-table.component.html',
  styleUrls: ['./quiz-table.component.scss']
})
export class QuizTableComponent implements OnInit {
  @Input() revealAllAnswer = false;
  @Input() showPunjabi = true;
  quizList: QuizQuestion[] = [];
  quizViewList: QuizQuestion[] = [];
  @Input()
  set quizListType(qType: string) {
    this.quizType = qType;
    if (qType == 'All') {
      this.getAllQuizList();
    } else {
      this.getQuizListByArg(qType);
    }
  }
  quizType = 'All';

  constructor(private quizSvc: MultiLingualQuizService,
              private _snackBar: MatSnackBar
  ) { }

  getFilenameFromUrl(url: string) {
    return url.split('/').pop();
  }

  ngOnInit(): void {
    this.getAllQuizList();
  }

  private getQuizListByArg(arg: string) {
    if (this.quizList.length == 0) {
      this._snackBar.open('Strange!!, Impossible!  Please contact Admin ASAP.')
    }
    this.quizViewList = [];
    this.quizList.forEach((quiz) => {
      if (quiz.argument == arg) {
        this.quizViewList.push(quiz);
      }
    });
  }

  private getAllQuizList() {
    this.quizSvc.getQuizQuestion().subscribe(
      (quizzes: QuizQuestion[]) => {
        this.quizList = quizzes;
        this.quizViewList = quizzes;
      }
    );
  }

  verifyAnswer(quizObj: any, answer: 'V' | 'F') {
    quizObj['isRight'] =
      (quizObj.ans == true && answer == 'V') ||
      (quizObj.ans == false && answer == 'F');
    quizObj['selected'] = answer;
    if (quizObj.isRight == false) {
      this._snackBar.open('Wrong Answered!', '', {duration: 1500})
    }
  }

}
