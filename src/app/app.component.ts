import {Component, OnInit} from '@angular/core';
import {MultiLingualQuizService, QuizArgument} from "./services/multi-lingual-quiz.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'quizPatenteClient';
  quizListType = 'All';
  showPunjabiTranslation = true;
  revealAnswer = false;
  argumentsList: QuizArgument[] = [];
  showHint: boolean = true;

  constructor(
    private quizSvc: MultiLingualQuizService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    // this.spinner.show();
    this.quizSvc.getArgumentsList().subscribe(
      (s: Map<string, QuizArgument>) => {
        const l = Array.from(s.values());
        this.argumentsList = l;
        // this.spinner.hide();
    });
  }

  showPunjabi() {
    this.showPunjabiTranslation = !this.showPunjabiTranslation;
  }
  revealAllAnswer() {
    this.revealAnswer = !this.revealAnswer;
  }
  showHintM() {
    this.showHint = !this.showHint;
    if (this.showHint == false) {
      this._snackBar.open('Green: Always Vero!, -=- Red: Always Falso!', '',{duration: 5000});
    }
  }
  quizTypeChange(arg: QuizArgument | 'All') {
    this.quizListType = arg == 'All' ? arg : arg.argName;
  }
}
