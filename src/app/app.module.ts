import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {QuizTableComponent} from './quiz-table/quiz-table/quiz-table.component';
import {HttpClientModule} from "@angular/common/http";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import { HighlightParticularWordPipe } from './pipes/highlight-particular-word.pipe';
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgxSpinnerComponent, NgxSpinnerModule} from "ngx-spinner";
import { NavigationComponent } from './components/navigation/navigation.component';
import {MultiLingualQuizService} from "./services/multi-lingual-quiz.service";
import { AppRoutingModule } from './app-routing.module';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatDividerModule} from "@angular/material/divider";
import { IntervalListComponent } from './components/interval-list/interval-list.component';
import { LandingComponent } from './components/landing/landing.component';
import { AllQuizListComponent } from './components/all-quiz-list/all-quiz-list.component';
import { QuizViewComponent } from './components/quiz-view/quiz-view.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import { ImageViewModalComponent } from './components/quiz-view/image-view-modal/image-view-modal.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatSliderModule} from "@angular/material/slider";
import {MatExpansionModule} from "@angular/material/expansion";
import { QuizByArgumentsComponent } from './components/quiz-by-arguments/quiz-by-arguments.component';
import {MdePopoverModule} from "@material-extended/mde";
import {MatCardModule} from "@angular/material/card";
import {VirtualScrollerModule} from "ngx-virtual-scroller";
import {ClickedWordPipe} from "./pipes/clicked-word.pipe";

export function initializeApp(appInitSvc: MultiLingualQuizService) {
  return () => appInitSvc.initQuizApp();

}

@NgModule({
  declarations: [
    AppComponent,
    QuizTableComponent,
    HighlightParticularWordPipe,
    NavigationComponent,
    IntervalListComponent,
    LandingComponent,
    AllQuizListComponent,
    QuizViewComponent,
    ImageViewModalComponent,
    QuizByArgumentsComponent,
    ClickedWordPipe
  ],
  imports: [
    VirtualScrollerModule,
    BrowserModule,
    BrowserAnimationsModule,
    MdePopoverModule,
    HttpClientModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    ScrollingModule,
    MatDialogModule,
    NgxSpinnerModule,
    AppRoutingModule,
    MatSidenavModule,
    MatDividerModule,
    MatSlideToggleModule,
    FormsModule,
    MatSliderModule,
    MatExpansionModule,
    MatCardModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initializeApp,
    deps: [MultiLingualQuizService],
    multi: true
  }],
  bootstrap: [AppComponent, NgxSpinnerComponent]
})
export class AppModule {
}
