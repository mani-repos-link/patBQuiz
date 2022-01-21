import {Component, OnInit} from '@angular/core';
import {MultiLingualQuizService} from "./services/multi-lingual-quiz.service";

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
  argumentsList: string[] = [];

  constructor(private quizSvc: MultiLingualQuizService) {
  }

  ngOnInit() {
    this.quizSvc.getArgumentsList().subscribe(
      (s: string[]) => {
      this.argumentsList = s;
    });
  }

  showPunjabi() {
    this.showPunjabiTranslation = !this.showPunjabiTranslation;
  }
  revealAllAnswer() {
    this.revealAnswer = !this.revealAnswer;
  }
  quizTypeChange(arg: string) {
    this.quizListType = arg;
  }
}
