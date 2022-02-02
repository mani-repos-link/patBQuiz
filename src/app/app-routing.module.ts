import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LandingComponent} from "./components/landing/landing.component";
import {AllQuizListComponent} from "./components/all-quiz-list/all-quiz-list.component";
import {QuizByArgumentsComponent} from "./components/quiz-by-arguments/quiz-by-arguments.component";



const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'all',
    component: AllQuizListComponent,
  },
  {
    path: 'quiz-by-arg/:argument',
    component: QuizByArgumentsComponent,
  }
  // { path: 'id_token', redirectTo: '' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }

