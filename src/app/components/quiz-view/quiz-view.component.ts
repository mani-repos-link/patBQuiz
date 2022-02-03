import {Component, HostListener, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MultiLingualQuizService, QuizDictionaryMeanings, QuizQuestion} from "../../services/multi-lingual-quiz.service";
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
  private quizDictionary!: Map<string, QuizDictionaryMeanings>;
  private currentPopOver: any[] = [];

  constructor(
    public dialog: MatDialog,
    public mQuizSvc: MultiLingualQuizService,
    private settingSvc: SettingsService,
  ) { }

  ngOnInit(): void {
    this.quizDictionary = this.mQuizSvc.getQuizDictionary();
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

  private onWordClick(word: string, dom: any) {
    // @ts-ignore
    const bs = window['bootstrap'];
    this.clickedWord = word;
    const w = word.replace(',', '')
      .replace('', '');
    let popover = bs.Popover.getInstance(dom);
    if (popover == null) {
      popover = new bs.Popover(dom, {
        animation: true,
        html: true,
        trigger: 'click',
        placement: 'top'
      });
      this.currentPopOver.push(popover);
      const m = this.quizDictionary.get(w) ||
        this.quizDictionary.get(w.toLowerCase()) ||
        this.quizDictionary.get(w.toLowerCase().replace('.', '').toLowerCase());
      if (m) {
        let content = '<b>Word "' + w + '" occurs ' + m.occurrence + ' times.</b>';
        content += '<br> Translation: ';
        content += '<br> English: <b>' + m.english + '</b>';
        content += '<br> German: ' + m.german;
        content += '<br> France: ' + m.france;
        content += '<br> Punjabi: ' + m.punjabi;
        content += '<br><button class="btn btn-secondary my-2 float-end">Close</button>' ;
        popover._config.content = content;
        popover._config.sanitizeFn = null;
        popover._config.allowList['button'] = ['*', 'class', 'onclick'];
      }
    }
    if (this.quizSetting.showTranslatedWords) {
      popover.show();
    }
  }

  @HostListener('window:click', ['$event'])
  onWindowClick(e: any) {
    if (this.currentPopOver?.length > 0 ) {
      this.currentPopOver.forEach((popover: any) => {
        popover.hide();
      });
    }
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
              this.onWordClick(e.target?.textContent, e.target);
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
