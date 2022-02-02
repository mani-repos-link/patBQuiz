import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {BreakpointObserver} from "@angular/cdk/layout";
import {BehaviorSubject, delay} from "rxjs";
import {MultiLingualQuizService, QuizArgument} from "../../services/multi-lingual-quiz.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxSpinnerService} from "ngx-spinner";
import {QuizSetting, SettingsService} from "../../services/setting/settings.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  argumentsList: QuizArgument[] = [];
  showHint: boolean = true;
  quizSetting!: QuizSetting;
  argMap?: Map<string, QuizArgument>;
  menuQuizByArgsOpen = false;

  constructor(
    private quizSvc: MultiLingualQuizService,
    private _snackBar: MatSnackBar,
    private settingSvc: SettingsService,
    private observer: BreakpointObserver,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.quizSvc.getArgumentsList().subscribe(
      (s: Map<string, QuizArgument>) => {
        const l = Array.from(s.values());
        this.argumentsList = l;
        this.listenQuizData();
      });
    this.listenSetting$();
    this.listenQuizData();
  }

  listenQuizData() {
    this.quizSvc.quizData?.argumentsList?.subscribe((argMap: Map<string, QuizArgument>) => {
      this.argMap = argMap;
    });
  }

  toggleMenuQuizByArgs() {
    this.menuQuizByArgsOpen = !this.menuQuizByArgsOpen;
  }

  private listenSetting$() {
    this.settingSvc.quizSettingSubject.subscribe((s: QuizSetting) => {
      this.quizSetting = s;
    });
  }

  alertMessage(msg: string) {
    alert(msg);
  }

  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        console.log(res.matches)
        if (res.matches) {
          this.sidenav.mode = 'push';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });
  }


}
