import { Component, OnInit } from '@angular/core';
import {MultiLingualQuizService, QuizArgument, QuizData} from "../../services/multi-lingual-quiz.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  quizInfo: QuizData | undefined;
  argumentsListSubject?: BehaviorSubject<Map<string, QuizArgument>>;
  argMap?: Map<string, QuizArgument>;
  constructor(private quizSvc: MultiLingualQuizService) { }

  ngOnInit(): void {
    this.quizInfo = this.quizSvc.quizData;
    this.listenQuizData();
  }

  listenQuizData() {
    this.argumentsListSubject = this.quizInfo?.argumentsList
    this.argumentsListSubject?.subscribe((argMap: Map<string, QuizArgument>) => {
      this.argMap = argMap;
    });
  }

}
