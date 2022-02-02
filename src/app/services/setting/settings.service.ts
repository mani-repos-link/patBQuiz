import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

export class QuizSetting {
  showPunjabi: boolean = false;
  showEnglish: boolean = false;
  showGerman: boolean = false;
  showFrance: boolean = false;
  revealAnswers: boolean = false;
  showHints: boolean = true;
  showTranslatedWords: boolean = true;
  isEnabledStickyIntervalOption: boolean = false;
  stickIntervalOnScroll: boolean = false;
  quizQuestionFontSize: number = 18;
  contributionOn: boolean = false;
  boldText: boolean = false;
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
