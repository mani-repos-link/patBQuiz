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
  @Input() quizQuestion: QuizQuestion | undefined;
  quizSetting!: QuizSetting;
  isQuizCorrect: boolean | undefined;
  currentAnswered: boolean | undefined;
  private subscription: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private settingSvc: SettingsService,
  ) { }

  ngOnInit(): void {
    this.listenSetting$();
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
