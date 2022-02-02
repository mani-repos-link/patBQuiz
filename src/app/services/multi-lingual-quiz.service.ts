import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, debounceTime, delay, from, Observable, Subject} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {TrickWordsListService} from "./trick-words-list.service";

export class QuizQuestion {
  image: string | undefined;
  quiz: string | undefined;
  ans: boolean | undefined;
  argument: string | undefined;
  img_name: string | undefined;
  lang_punj: string | undefined;
  selected?: any;
  isRight?: any;
}

export class QuizData {
  argumentsList: BehaviorSubject<Map<string, QuizArgument>> =
    new BehaviorSubject<Map<string, QuizArgument>>(new Map<string, QuizArgument>());
  quizzes: BehaviorSubject<QuizQuestion[]> = new BehaviorSubject<QuizQuestion[]>([]);
  totalQuizzes: number = 0;
  totalHints: number = 0;
  totalArguments: number = 0;
  totalSignQuestions: number = 0;
  totalSigns: number = 0;
  totalVeroQuestions: number = 0;
}
export class QuizArgument {
  argName: string = '';
  questions: QuizQuestion[] = [];
  totalHints: number = 0;
  totalQuizzes: number = 0;
  totalVero: number = 0;
  totalFalso: number = 0;
}

@Injectable({
  providedIn: 'root'
})
export class MultiLingualQuizService {
  public quizData: QuizData = new QuizData();
  private _jsonURL = 'assets/rev-quiz-multi.json';
  private appInit$: BehaviorSubject<boolean>
    = new BehaviorSubject<boolean>(false);
  // @ts-ignore
  private quizDataSubject: BehaviorSubject<QuizData> = new BehaviorSubject<QuizData>(null);

  constructor(
    private http: HttpClient,
    private twlSvc: TrickWordsListService,
    private spinSvc: NgxSpinnerService
  ) { }

  initQuizApp(): Promise<any> {
    this.spinSvc.show('Loading app...', {showSpinner: true});
    const appInit$ = this.appInit$.pipe(
      delay(2000),
      debounceTime(3000)
    );
    this.initQuizData();
    appInit$.subscribe((r: boolean) => {
      console.log(r);
      this.spinSvc.hide('', 500);
    });
    return Promise.allSettled([appInit$]);
  }

  private initQuizData() {
    this.getMultiLingualQuiz().subscribe(
      (quiz_data: QuizQuestion[]) => {
        this.mapQuizInArguments(quiz_data);
        this.quizData.quizzes.next(quiz_data);
        this.quizData.totalQuizzes = quiz_data.length;
        this.appInit$.next(true);
        this.quizDataSubject.next(this.quizData);
      }
    );
  }

  private mapQuizInArguments(quiz_data: QuizQuestion[]) {
    this.quizData.totalSignQuestions = 0;
    const quizData: { [key: string]: QuizQuestion[] } = {};
    const totalSigns = new Map();
    quiz_data.forEach((quiz: QuizQuestion) => {
      if (quiz.argument) {
        if (quizData[quiz.argument] == null) { quizData[quiz.argument] = []; }
        quizData[quiz.argument].push(quiz);
      }
      if (quiz.image && quiz.image.length > 0) {
        totalSigns.set(quiz.image, 0);
        this.quizData.totalSignQuestions++;
      }
    });
    this.quizData.totalSigns = totalSigns.size;
    this.generateQuizArgumentsData(quizData);
  }

  private generateQuizArgumentsData(quizData: { [key: string]: QuizQuestion[] }) {
    const argList: Map<string, QuizArgument> = new Map<string, QuizArgument>();
    this.quizData.totalHints = 0;
    this.quizData.totalVeroQuestions = 0;
    const keys: string[] = Object.keys(quizData);
    Object.values(quizData).forEach((quizList: QuizQuestion[], idx: number) => {
      const qa: QuizArgument = new QuizArgument();
      qa.argName = keys[idx];
      qa.totalQuizzes = quizList.length;
      const hintsData = this.countHints(quizList);
      qa.totalHints = hintsData.total;
      qa.totalVero = hintsData.vero;
      qa.totalFalso = hintsData.falso;
      qa.questions = quizList;
      this.quizData.totalHints += qa.totalHints;
      this.quizData.totalVeroQuestions += qa.totalVero;
      argList.set(keys[idx], qa);
    });
    this.quizData.totalArguments = keys.length;
    this.quizData.argumentsList.next(argList);
  }

  private countHints(quizList: QuizQuestion[]): {total: number, vero: number, falso: number} {
    let counter = 0;
    let vero = 0;
    const allWords = this.twlSvc.correct_words_list.concat(this.twlSvc.incorrect_words_list);
    if (quizList?.length > 0) {
      quizList.forEach((quiz: QuizQuestion) => {
        if (quiz.ans) {
          vero++;
        }
        const str1 = quiz.quiz + '';
        allWords.forEach((word: string) => {
          word = word.trim();
          const wordIdx = str1.toLowerCase().indexOf(word.toLowerCase());
          if (wordIdx >= 0) {
            counter++;
          }
        });
      });
    }
    return {total: counter, vero, falso: quizList.length - vero};
  }

  private countMatchInSentence(quizList: QuizQuestion[], words: string[]) {
    let counter = 0;
    if (quizList?.length > 0) {
      quizList.forEach((quiz: QuizQuestion) => {
        const str1 = quiz.quiz + '';
        words.forEach((word: string) => {
          word = word.trim();
          const wordIdx = str1.toLowerCase().indexOf(word.toLowerCase());
          if (wordIdx >= 0) {
            counter++;
          }
        });
      });
    }
    return counter;
  }

  public getMultiLingualQuiz(): Observable<any> {
    return this.http.get(this._jsonURL);
  }

  public getQuizQuestion(): Observable<QuizQuestion[]> {
    return this.quizData.quizzes;
  }

  public getArgumentsList(): Observable<Map<string, QuizArgument>> {
    return this.quizData.argumentsList;
  }

  public getQuizData(): Observable<QuizData> {
    return this.quizDataSubject.pipe();
  }

}
