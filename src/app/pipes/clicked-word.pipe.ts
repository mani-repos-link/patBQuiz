import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {TrickWordsListService} from "../services/trick-words-list.service";

@Pipe({
  name: 'clickedWord'
})
export class ClickedWordPipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer,
    private twlSvc: TrickWordsListService
  ){}

  ignoreWordList = [
    'il', 'lo', 'li', 'gli', 'la', 'le', 'un', 'da', 'dalla', 'dallo', 'dello', 'degli', 'dei',
    'del', 'dagli', 'dello', 'della', 'su', 'un', 'una', 'uno', 'è', 'a', 'ed', 'che', 'sia', 'si',
    'e', 'in', 'nel', 'nello', 'ad', 'allo', 'agli', 'alle', 'di', 'o', 'i', 'ai'
  ]

  transform(value: string | undefined, passAsString: boolean, ...args: unknown[]): SafeHtml | string {
    const val: string[] = value?.split(' ') || [];
    let newSentence = '';
    val.forEach((word: string) => {
      if (word?.length > 0) {
        if (!this.ignoreWordList.includes(word.toLowerCase())) {
          newSentence = newSentence + ' <span class="quiz-question-word">'+word+'</span>';
        } else {
          newSentence += ' ' + word;
        }
      }
    });
    return passAsString ? newSentence: this.sanitizer.bypassSecurityTrustHtml(newSentence);
  }

}
