import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {QuizSetting, SettingsService} from "../../services/setting/settings.service";
import {MultiLingualQuizService, QuizArgument, QuizData} from "../../services/multi-lingual-quiz.service";

@Component({
  selector: 'app-quiz-by-arguments',
  templateUrl: './quiz-by-arguments.component.html',
  styleUrls: ['./quiz-by-arguments.component.scss']
})
export class QuizByArgumentsComponent implements OnInit {

  urlParamArgument: string | undefined;
  quizData!: QuizData;
  quizSetting!: QuizSetting;
  argMap?: Map<string, QuizArgument>;
  quizArgument: QuizArgument | undefined;
  constructor(
    private quizSvc: MultiLingualQuizService,
    private router: Router,
    private settingSvc: SettingsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe( (params) => {
      this.urlParamArgument = params['argument'];
      this.listQuizArgument();
    });
    this.listenQuizData();
    this.listenSetting$();
  }

  private listenQuizData() {
    this.quizSvc.getQuizData().subscribe((quizData: QuizData) => {
      this.quizData = quizData;
      this.listQuizArgument();
    });
  }

  private listQuizArgument() {
    if (this.quizData == null) {
      return;
    }
    this.quizData?.argumentsList.subscribe((arm: Map<string, QuizArgument>) => {
      this.argMap = arm;
      if (this.urlParamArgument != null) {
        this.quizArgument = arm.get(this.urlParamArgument);
      }
    })
  }

  private listenSetting$() {
    this.settingSvc.quizSettingSubject.subscribe((s: QuizSetting) => {
      this.quizSetting = s;
    });
  }

}
