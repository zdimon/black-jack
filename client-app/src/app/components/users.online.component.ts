import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { SocketService } from '../services/socket.service';


@Component({
  selector: 'app-users-online',
  template: `
  <ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-menu-button></ion-menu-button>
    </ion-buttons>
    <ion-title>
      Users online
    </ion-title>
    <ion-buttons slot="end">
      <ion-button 
      color="success"
      fill="outline" 
      slot="end" 
      (click)="update()">
      <ion-icon name="undo"></ion-icon>
      </ion-button> 
    </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-list>
      <ion-item *ngFor="let user of users_online">
        <ion-icon name="happy" slot="start"></ion-icon>
        <ion-label>{{ user }}</ion-label>
        <ion-button 
        color="success"
        fill="outline" 
        slot="end" 
        (click)="inviteUser(user)"
        *ngIf="user!=mylogin">
          Join
        </ion-button>
      </ion-item>
    </ion-list>
    <ion-button 
    color="success" 
    expand="full"
    (click)="playWithBot()">
      Play with bot.
    </ion-button>
  </ion-content>
  `
})
export class UsersOnlineComponent implements OnInit {
  users_online: any= [];
  room: any;
  mylogin: string;
  constructor(private router: Router, private socket_service: SocketService){
  }

  ngOnInit(){
      this.mylogin = localStorage.getItem('username');
      this.socket_service.login(this.mylogin);
      this.socket_service.usersOnline$.subscribe((users_online: any) => {
        this.users_online = users_online;
        console.log('Getting online users');
      })
      this.socket_service.createRoom$.subscribe((room: any) => {
        this.room = room;
        this.router.navigate(["room", room.uuid]);
      })
      
        this.socket_service.getUsersOnline();
      
     
  }

  inviteUser(username: string){
    console.log(`invite ${username}`);
    this.socket_service.createRoom(localStorage.getItem('username'),username);
  }

  update(){
    this.socket_service.getUsersOnline();
  }

  playWithBot(){
    this.socket_service.createRoom(localStorage.getItem('username'),'BotFor'+localStorage.getItem('username'));
  }

}
