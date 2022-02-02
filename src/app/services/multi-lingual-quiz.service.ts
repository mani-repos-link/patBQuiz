import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, debounceTime, map, Observable} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {TrickWordsListService} from "./trick-words-list.service";
import {InitSpinnerService} from "./init-spinner/init-spinner.service";

export class QuizQuestion {
  image: string | undefined;
  quiz: string | undefined;
  ans: boolean | undefined;
  argument: string | undefined;
  img_name: string | undefined;
  selected?: any;
  isRight?: any;
  languages?: {
    punjabi: QuizLanguageInterface;
    english: QuizLanguageInterface;
    german: QuizLanguageInterface;
    france: QuizLanguageInterface;
  };
}

export class QuizLanguageInterface {
  question?: string;
  verified?: boolean;
  verifiedDate: Date | undefined;
  addedData?: Date;
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

export class QuizDictionaryMeanings {
  occurrence?: number;
  punjabi?: string;
  english?: string;
  german?: string;
  france?: string;
  italiano?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MultiLingualQuizService {
  public quizData: QuizData = new QuizData();
  private _quizDataURL = 'assets/rev-quiz-multi.json';
  private _quizWordURL = 'assets/quiz-words.json';
  private appInit$: BehaviorSubject<boolean>
    = new BehaviorSubject<boolean>(false);
  // @ts-ignore
  private quizDataSubject: BehaviorSubject<QuizData> = new BehaviorSubject<QuizData>(null);

  private quizDictionary!: Map<string, QuizDictionaryMeanings>;

  constructor(
    private http: HttpClient,
    private twlSvc: TrickWordsListService,
    private initSpinnerSvc: InitSpinnerService,
    private spinSvc: NgxSpinnerService
  ) { }

  initQuizApp(): Promise<any> {
    this.initSpinnerSvc.showSpinner('Loading app...');
    const appInit$ = this.appInit$.pipe(
      debounceTime(500)
    );
    this.initQuizData();
    const promiseInit = new Promise((resolve, reject) => {
      appInit$.subscribe((r: boolean) => {
        resolve(r);
        this.initSpinnerSvc.hideSpinner();
      });
    });
    return Promise.allSettled([promiseInit, this.initQuizDictionary()]);
  }

  public getQuizDictionary(): Map<string, QuizDictionaryMeanings> {
    return this.quizDictionary;
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

  private initQuizDictionary() {
    return new Promise((resolve, reject) => {
      this.initSpinnerSvc.showSpinner('Loading dictionary...');
      this.getQuizQuestionsWordsQuiz().subscribe((e: Map<string, QuizDictionaryMeanings>) => {
        this.quizDictionary = e;
        resolve(true);
      });
    });
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
    return this.http.get(this._quizDataURL);
  }

  public getQuizQuestionsWordsQuiz(): Observable<Map<string, QuizDictionaryMeanings>> {
    return this.http.get<Map<string, QuizDictionaryMeanings>>(this._quizWordURL).pipe(
      map((d: any) => {
        const m = new Map<string, QuizDictionaryMeanings>();
        const keys = Object.keys(d);
        keys.forEach((key: string) => {
          if (key && key.length > 2) {
            m.set(key.toLowerCase(), d[key]);
          }
        })
        return m;
      })
    );
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
