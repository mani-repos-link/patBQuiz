import {Component, Input, OnInit} from '@angular/core';
import {MultiLingualQuizService} from "../../services/multi-lingual-quiz.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-quiz-table',
  templateUrl: './quiz-table.component.html',
  styleUrls: ['./quiz-table.component.scss']
})
export class QuizTableComponent implements OnInit {
  quizList = [];
  @Input()
  revealAllAnswer = false;
  constructor(private quizSvc: MultiLingualQuizService,
              private _snackBar: MatSnackBar
  ) { }

  getFilenameFromUrl(url: string) {
    return url.split('/').pop();
  }
  ngOnInit(): void {
    this.quizSvc.getMultiLingualQuiz().subscribe(
      (quizzes) => {
        this.quizList = quizzes;
        console.log(this.quizList)
      }
    );
  }

  verifyAnswer(quizObj: any, answer: 'V' | 'F') {
    quizObj['isRight'] = (quizObj.ans == true && answer == 'V') || (quizObj.ans == false && answer == 'F');
    if (quizObj.isRight == false) {
      this._snackBar.open('Wrong Answered!', '', {duration: 1500})
    }
    console.log(quizObj.ans, answer)
  }

}
