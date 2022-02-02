import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {TrickWordsListService} from "../services/trick-words-list.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Pipe({
  name: 'highlightParticularWord'
})
export class HighlightParticularWordPipe implements PipeTransform {
  constructor(
    private sanitizer: DomSanitizer,
    private twlSvc: TrickWordsListService
  ){}

  transform(value: any | string, ...args: any[]): any {
    if (!value) {
      return value;
    }
    let newStr = value.trim();
    this.twlSvc.correct_words_list.forEach((word: string) => {
      word = word.trim();
      const wordIdx = newStr.toLowerCase().indexOf(word.toLowerCase());
      if (wordIdx >= 0) {
        newStr = newStr.replace(word, "<span style='background-color: greenyellow' title=" + word + "> " + word + " </span>")
      }
    });
    this.twlSvc.incorrect_words_list.forEach((word: string) => {
      word = word.trim();
      const wordIdx = newStr.toLowerCase().indexOf(word.toLowerCase());
      if (wordIdx >= 0) {
        newStr = newStr.replace(word, "<span style='background-color: indianred' title=" + word + "> " +word+ " </span>")
      }
    });
    return this.sanitizer.bypassSecurityTrustHtml(newStr);
  }



}
