import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MultiLingualQuizService {

  private _jsonURL = 'assets/rev-quiz-multi.json';
  constructor(private http: HttpClient) { }

  public getMultiLingualQuiz(): Observable<any> {
    return this.http.get(this._jsonURL);
  }

}
