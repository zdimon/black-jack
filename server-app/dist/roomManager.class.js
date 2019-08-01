"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deck_class_1 = require("../client-app/src/app/deck.class");
const card_class_1 = require("../client-app/src/app/game/card.class");
const uuidv1 = require('uuid/v1');
/*
  {
    uuid: 'id'
    deck: deck,
    bet: 10,
    current_player: 'Dima',
    status: 'active',
    winner: '',
    users: [
      {
          username: 'Dima',
          account: 100,
          points: 12,
          is_stoped: false,
          cards: [
              Card, Card
          ]
      },
      
      {
          username: 'Vova',
          account: 100,
          points: 12,
          is_stoped: false,
          cards: [
              Card, Card
          ]
      }
                
    ]
  }
*/
class RoomManager {
    constructor() {
        this.users = [];
        this.overboard = 21;
    }
    checkWinner() {
        // проигрыш по перебору
        for (var u of this.users) {
            if (u.points > this.overboard) {
                this.status = 'finished';
                for (var uu of this.users) {
                    if (uu.username !== u.username) {
                        this.winner = uu.username;
                        uu.account += this.bet;
                        u.account -= this.bet;
                    }
                }
                this.showAllCards();
                return true;
            }
        }
        // выиграш если оба остановились  
        let stoped_users = 0;
        for (var u of this.users) {
            if (u.is_stoped) {
                stoped_users = stoped_users + 1;
            }
        }
        if (stoped_users == 2) {
            if (this.users[0].points > this.users[1].points) {
                this.status = 'finished';
                this.winner = this.users[0].username;
                this.users[0].account += this.bet;
                this.users[1].account -= this.bet;
                this.showAllCards();
            }
            if (this.users[0].points < this.users[1].points) {
                this.status = 'finished';
                this.winner = this.users[1].username;
                this.users[1].account += this.bet;
                this.users[0].account -= this.bet;
                this.showAllCards();
            }
            if (this.users[0].points == this.users[1].points) {
                this.status = 'finished';
                this.winner = 'draw';
                this.showAllCards();
            }
        }
    }
    showAllCards() {
        for (var u of this.users) {
            for (let card of u.cards) {
                card.faceUp();
            }
        }
    }
    hideOpponentCards(username) {
        if (this.status == 'active') {
            for (var u of this.users) {
                if (username !== u.username) {
                    for (let card of u.cards) {
                        card.faceDown();
                    }
                }
                else {
                    for (let card of u.cards) {
                        card.faceUp();
                    }
                }
            }
        }
    }
    getCardByUser(username) {
        for (var u of this.users) {
            if (username === u.username) {
                let card = this.deck.getCard();
                card.faceUp();
                u.cards.push(card);
                u.points = u.points + card.getScore();
            }
        }
        this.checkWinner();
    }
    stopGettingCardByUser(username) {
        for (var u of this.users) {
            if (username !== u.username) {
                this.current_player = u.username;
            }
            else {
                u.is_stoped = true;
            }
        }
        this.checkWinner();
    }
    static createRoom(owner, opponent) {
        const deck = new deck_class_1.Deck();
        deck.shuffleDeck(3);
        const card = new card_class_1.Card(2, 2);
        card.faceUp();
        var room = new RoomManager();
        room.uuid = uuidv1();
        room.deck = deck;
        room.bet = 10;
        room.winner = 'undefined';
        room.current_player = owner;
        room.status = 'active';
        room.users = [];
        room.users.push({ 'username': owner, is_stoped: false, account: 100, points: 0, cards: [] });
        room.users.push({ 'username': opponent, is_stoped: false, account: 100, points: 0, cards: [] });
        return room;
    }
}
exports.RoomManager = RoomManager;
//# sourceMappingURL=roomManager.class.js.map