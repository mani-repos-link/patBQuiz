import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {QuizQuestion} from "../../../services/multi-lingual-quiz.service";

@Component({
  selector: 'app-image-view-modal',
  templateUrl: './image-view-modal.component.html',
  styleUrls: ['./image-view-modal.component.scss']
})
export class ImageViewModalComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data: QuizQuestion) {}

  ngOnInit(): void {
  }

}
