import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {QuizQuestion} from "../../services/multi-lingual-quiz.service";
import {QuizSetting, SettingsService} from "../../services/setting/settings.service";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ImageViewModalComponent} from "./image-view-modal/image-view-modal.component";

@Component({
  selector: 'app-quiz-view',
  templateUrl: './quiz-view.component.html',
  styleUrls: ['./quiz-view.component.scss']
})
export class QuizViewComponent implements OnInit, OnDestroy {

  @Input() listIndex: number | undefined;
  @Input() quizQuestion!: QuizQuestion;
  quizSetting!: QuizSetting;
  isQuizCorrect: boolean | undefined;
  currentAnswered: boolean | undefined;
  private subscription: Subscription = new Subscription();
  clickedWord: string  | undefined;

  constructor(
    public dialog: MatDialog,
    private settingSvc: SettingsService,
  ) { }

  ngOnInit(): void {
    this.listenSetting$();
    this.addEventListenerToWords();
  }

  private listenSetting$() {
    const subs = this.settingSvc.quizSettingSubject.subscribe((s: QuizSetting) => {
      this.quizSetting = s;
    });
    this.subscription.add(subs);
  }

  openImageViewDialog() {
    this.dialog.open(ImageViewModalComponent, {
      data: this.quizQuestion
    });
  }

  checkAnswer(ans: boolean): void {
    this.currentAnswered = ans;
    this.isQuizCorrect = this.quizQuestion?.ans == ans;
  }

  onWordClick(word: string) {
    this.clickedWord = word;
    console.log(word);
  }

  private addEventListenerToWords() {
    const cls = document.getElementsByClassName('quiz-question-word');
    if (cls && cls.length > 0) {
      for (let i = 0; i < cls.length; i++) {
        if (cls[i].getAttribute('id') == null) {
          cls[i].setAttribute('id', this.guidGenerator());
          cls[i].addEventListener('click', (e: Event | any) => {
            e.stopPropagation();
            e.preventDefault();
            if (e.target && e.target?.textContent) {
              this.onWordClick(e.target?.textContent);
            }
          }, true);
        }
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  guidGenerator(): string {
    const S4 = () => {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }

}
