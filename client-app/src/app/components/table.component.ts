import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-game-table',
  template: `

    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title *ngIf="me">
          <span style="color: green">{{ me.points  }}</span> points
        </ion-title>
        <ion-buttons slot="end" *ngIf="me && room">

          <ion-button 
          color="danger"
          fill="outline" 
          slot="end" 
          (click)="stopGettingCard()"
          *ngIf="room.current_player==me.username && room.current_player==me.username && room.status=='active'">
            Stop
          </ion-button> 

          <ion-button 
          fill="outline" 
          color="success"
          slot="end" 
          (click)="getCard()" 
          *ngIf="room.current_player==me.username && room.current_player==me.username &&room.status=='active'">
            Get the card
          </ion-button>

          <ion-button 
          color="danger"
          fill="outline" 
          slot="end" 
          (click)="newGame()"
          *ngIf="room.status=='finished'">
            New game
          </ion-button>

          <ion-button 
          color="success"
          fill="outline" 
          slot="end" 
          (click)="changeBet('plus')"
          *ngIf="room.winner==me.username && room.status=='finished'">
            Raise the bid
          </ion-button>

          <ion-button 
          color="danger"
          fill="outline" 
          slot="end" 
          (click)="changeBet('minus')"
          *ngIf="room.winner==me.username && room.status=='finished'">
            Lower the bid
          </ion-button>

        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content *ngIf="room">

    <ion-card class="my-alert" *ngIf="room.winner !== 'undefined' ">
      <ion-item>
         <h2 *ngIf="room.winner==username" style="color: green">WIN! ({{me.points}}/{{other.points}})</h2>
         <h2 *ngIf="room.winner!=username && room.winner!='draw'" style="color: red">LOST! ({{me.points}}/{{other.points}})</h2>
         <h2 *ngIf="room.winner=='draw'" style="color: yellow">DRAW ({{me.points}}/{{other.points}}) :-(</h2>
      </ion-item>
    </ion-card> 
    
    <ion-card *ngIf="room && me">
      <ion-item>
        <ion-card-header>Bit: {{ room.bet }} $</ion-card-header>
        <div class="item-note" slot="end">
        Balance: {{me.account}} $
      </div>
      </ion-item>
    </ion-card>    

    <ion-card *ngIf="me" [style.backgroundColor]="room.current_player==me.username ? 'green' : 'silver'">
      <ion-card-header style="color: black">Your cards:</ion-card-header>
      <ion-card-content >
          <ion-item>
            <ul>
              <li *ngFor="let card of me.cards"><app-card [card]="card"></app-card></li>
            </ul>
          </ion-item>
      </ion-card-content>
    </ion-card>
    
    
    
      <ion-card *ngIf="other" [style.backgroundColor]="room.current_player==other.username ? 'green' : 'silver'">
        <ion-card-header style="color: black">{{ other.username }}'s cards</ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label>Score:</ion-label>
            <ion-label slot="end">{{ other.points  }}$</ion-label>
          </ion-item>
          <ion-item>
            <ul>
              <li *ngFor="let card of other.cards"><app-card [card]="card"></app-card></li>
            </ul>
          </ion-item>
        </ion-card-content>
      </ion-card>




    </ion-content>

  `,
  styles: [
            'div {margin: 10px}',
            '.my-active {border: 1px solid green }',
            '.my-noactive {border: 1px solid silver }',
            'li { display: inline-block; margin: 5px; }',
            '.my-alert {background: red }',

          ]
})
export class TableComponent implements OnInit {
  username: string ='';
  room: any;
  me: any = {};
  other: any = {};
  constructor(
      private router: Router,
      private socket_service: SocketService,
      private activatedRoute: ActivatedRoute){
  }

  ngOnInit(){
    if(!localStorage.getItem('username')){
      this.router.navigate(['login']);
    } else {
      this.username = localStorage.getItem('username');
    }
    this.socket_service.getRoom$.subscribe((room: any) => {
        this.room = room;
        for(let u of room.users){
          if(u.username == this.username) {
            this.me = u;
          } else {
            this.other = u;
          }
        }
    });
    let uuid = this.activatedRoute.snapshot.paramMap.get('uuid')
    this.socket_service.getRoom(uuid);
  }

  getCard(){
     this.socket_service.getCard({'username':this.username, 'room_uuid': this.room.uuid});
  }

  stopGettingCard(){
    this.socket_service.stopGettingCard({'username':this.username, 'room_uuid': this.room.uuid});
 }

  newGame(){
      this.socket_service.newGame({'username':this.username, 'room_uuid': this.room.uuid});
  }

  changeBet(type: string){
    this.socket_service.changeBet({'type':type, 'room_uuid': this.room.uuid});
  }

}