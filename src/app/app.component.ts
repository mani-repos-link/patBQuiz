import {Component, OnInit} from '@angular/core';
import {MultiLingualQuizService, QuizArgument} from "./services/multi-lingual-quiz.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {NgcCookieConsentService} from "ngx-cookieconsent";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'quizPatenteClient';
  argumentsList: QuizArgument[] = [];
  showHint: boolean = true;

  constructor(
    private ccService: NgcCookieConsentService,
    private quizSvc: MultiLingualQuizService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    // this.spinner.show();
    this.loadConsent();
    this.quizSvc.getArgumentsList().subscribe(
      (s: Map<string, QuizArgument>) => {
        const l = Array.from(s.values());
        this.argumentsList = l;
        // this.spinner.hide();
    });
  }

  private loadConsent() {
    const isConsentAlready = localStorage.getItem('cookie-consent');
    console.log(isConsentAlready)
    if (isConsentAlready == undefined) {
      // this.ccService.open();
      localStorage.setItem('cookie-consent', JSON.stringify(true));
    } else {
      console.log('closing')
      this.ccService.close(false);
    }

  }
}
