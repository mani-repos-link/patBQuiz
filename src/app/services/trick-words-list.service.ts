import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrickWordsListService {

  incorrect_words_list = [
    'Mai',
    'chiusa',
    'frizione',
    'unicamente',
    'vanno',
    'diurne',
    'interrotta',
    'obbligatoriamente',
    'quanti',
    'affiancati',
    'alternato',
    'avvisatore',
    'facoltativo',
    'infrazione',
    'parco',
    'richiamare',
    'tutta',
    'acceleratore',
    'allontanare',
    'bere',
    'chilometro',
    'mezzeria',
    'nastro',
    'necessitano',
    'ognuna',
    'prosegue',
    'smontare',
    'spazzatura',
    'tenuti',
    'veda',
    'accelerando',
    'acciaio',
    'adesivo',
    'alcuna',
    'apporre',
    'assolutamente',
    'rallentare solo'
  ];

  correct_words_list = [
    'Richiede',
    'brusche',
    'improvvisamente',
    'potrebbe',
    'alcune',
    'impedire',
    'ordinariamente',
    'aprire',
    'effettiva',
    'esterno',
    'sedile abbagliare',
    'ben',
    'difficolotoso',
    'diminuzione',
    'frenate',
    'rendere',
    'ripetuto',
    'accinge',
    'causare',
    'comportare',
    'dovuto',
    'incorrere',
    'intralciare',
    'limitare',
    'luoghi',
    'movimenti',
    'periodo',
    'potersi',
    'ridotto',
    'rimuovere',
    'sporgente',
    'tamponare',
    'tornanti'
  ];

  constructor() { }
}
