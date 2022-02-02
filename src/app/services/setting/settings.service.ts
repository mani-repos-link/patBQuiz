import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

export class QuizSetting {
  showPunjabi: boolean = false;
  revealAnswers: boolean = false;
  showHints: boolean = false;
  isEnabledStickyIntervalOption: boolean = false;
  stickIntervalOnScroll: boolean = false;
  quizQuestionFontSize: number = 14;
  boldText: boolean = true;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private quizSetting: QuizSetting = new QuizSetting();
  quizSettingSubject: BehaviorSubject<QuizSetting>;

  constructor() {
    this.quizSettingSubject = new BehaviorSubject<QuizSetting>(this.quizSetting);
  }


}
