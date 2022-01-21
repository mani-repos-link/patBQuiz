import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {from, Observable, Subject} from "rxjs";

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

@Injectable({
  providedIn: 'root'
})
export class MultiLingualQuizService {
  private quiz_data: { [key: string]: QuizQuestion[] } = {};
  private quizzes: QuizQuestion[] = [];
  private _jsonURL = 'assets/rev-quiz-multi.json';
  private quizQuestions$: Subject<QuizQuestion[]> = new Subject();
  private argumentList$: Subject<string[]> = new Subject();


  constructor(private http: HttpClient) {
    this.getMultiLingualQuiz().subscribe(
      (quiz_data) => {
        quiz_data.forEach((quiz: QuizQuestion) => {
          if (quiz.argument) {
            if (this.quiz_data[quiz.argument] == null) {
              this.quiz_data[quiz.argument] = [];
            }
            this.quiz_data[quiz.argument].push(quiz);
          }
        });
        this.quizzes = quiz_data;
        this.quizQuestions$.next(quiz_data);
        this.argumentList$.next(Object.keys(this.quiz_data));
      }
    );
  }

  public getMultiLingualQuiz(): Observable<any> {
    return this.http.get(this._jsonURL);
  }

  public getQuizQuestion(): Observable<QuizQuestion[]> {
    // return from(Object.values(this.quiz_data));
    return this.quizQuestions$.asObservable();
  }

  public getArgumentsList(): Observable<string[]> {
    // return from(Object.keys(this.quiz_data));
    return this.argumentList$.asObservable();
  }


}
