import { Card } from './card.class';


interface IDeck {
  faces: number[];
  ranks: number[];
  cards: Card[];
  create(): void;
  getCard(): Card;
  shuffleDeck(times: number): void;
}

export class Deck implements IDeck{
   faces: number[];
   ranks: number[];
   cards: Card[] = [];
   constructor(){
    this.ranks = [1,2,3,4,5,6,7,8,9,10,11,12,13];
    this.faces = [1,2,3,4];
    this.create();
   }
   create(){
      for(let f of this.faces){
        for(let r of this.ranks){
          this.cards.push(new Card(r, f));
        }
      }
   }

   getCard(): Card {
    if (this.cards.length == 0) {
        throw new Error('No Cards In Deck');
    }
    return this.cards.shift();
  }

  shuffleDeck(times: number): void {
    var j, x, i, t;
    for (t = 0; t < times; t++) {
        for (i = this.cards.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = this.cards[i - 1];
            this.cards[i - 1] = this.cards[j];
            this.cards[j] = x;
        }
    }
  }

  public static fabric(deck: Deck): Deck {
    const d = new Deck()
    var cards = [];
    for(let c of deck.cards){
      cards.push(new Card(c.Ranck, c.Face));
    }
    d.cards = cards;
    console.log(d);
    return d;
  }

}
