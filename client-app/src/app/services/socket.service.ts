import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Deck } from '../class/deck.class';
import { Card } from '../class/card.class';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  deck$ = this.socket.fromEvent<Deck>('action:getDeck');
  card$ = this.socket.fromEvent<Card>('action:getCard');
  createRoom$ = this.socket.fromEvent<string>('action:createRoom');
  getRoom$ = this.socket.fromEvent<string>('action:getRoom');
  usersOnline$ = this.socket.fromEvent<any>('action:getUsersOnline');
  checkLoginResult$ = this.socket.fromEvent<any>('action:checkLoginResult');

  login$ = this.socket.fromEvent<Deck>('action:login');
  logout$ = this.socket.fromEvent<Deck>('action:logout');

  constructor(private socket: Socket) { }

  getNewDeck() {
    this.socket.emit('getNewDeck');
  }

  checkLogin(username: string) {
    this.socket.emit('checkLogin',username);
  }

  login(username: string) {
    this.socket.emit('login',username);
  }

  unlogin(uuid: string) {
    this.socket.emit('unlogin',uuid);
  }

  getUsersOnline() {
    this.socket.emit('getUsersOnline');
  }

  createRoom(owner: string, opponent: string) {
    this.socket.emit('createRoom',{owner:owner, opponent: opponent});
  }

  getRoom(uuid: string) {
    this.socket.emit('getRoom',{uuid:uuid});
  }

  getCard(data: any) {
    this.socket.emit('getCard', data);
  }

  stopGettingCard(data: any) {
    this.socket.emit('stopGettingCard', data);
  }

  newGame(data: any){
    this.socket.emit('newGame', data);
  }

  changeBet(data: any){
    this.socket.emit('changeBet', data);
  }


}
