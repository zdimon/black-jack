import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../class/card.class';

@Component({
  selector: 'app-card',
  template: `
       <div (click)="flip()" [style.background-position-x.px]="card.XBgPosition" [style.background-position-y.px]="card.YBgPosition"></div>

       `,
  styles: ['div { background: url("/assets/cards.png"); width: 69px; height: 94px;}']
})
export class CardComponent implements OnInit {

  @Input() card: Card;
  constructor() {

  }

  ngOnInit() {
  }

  doFaceDown(){
    this.card.faceDown();
  }

  doFaceUp(){
    this.card.faceUp();
  }

  flip(){
    if(this.card.XBgPosition==0){
      this.card.faceUp();
    } else {
      this.card.faceDown();
    }
  }

}
