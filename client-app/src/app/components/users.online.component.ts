import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router, NavigationEnd} from "@angular/router";
import { SocketService } from '../services/socket.service';
import { Subscription, Observable } from "rxjs";

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
      <ion-item>
      <ion-button 
      color="success" 
      expand="full"
      (click)="playWithBot()">
        Play with bot.
      </ion-button>
      </ion-item>
    </ion-list>

  </ion-content>
  `
})
export class UsersOnlineComponent implements OnInit, OnDestroy {
  users_online: any= [];
  room: any;
  mylogin: string;
  usersOnline_subscription: Subscription;
  createRoom_subscription: Subscription;


  constructor(private router: Router, private socket_service: SocketService){
    this.router.events.subscribe(e => { 
      if (e instanceof NavigationEnd) {
        console.log('NavigationEnd:', event);
        setTimeout(() => {
          console.log('getting user online');
          this.socket_service.getUsersOnline();
          
        },1000);
      }
    }
    );
  }

  ngOnInit(){
      console.log('On init');
      this.mylogin = localStorage.getItem('username');
      this.socket_service.login(this.mylogin);
      this.usersOnline_subscription = this.socket_service.usersOnline$.subscribe((users_online: any) => {
        
        this.users_online = users_online;
        console.log('Getting online users');
      })
      this.createRoom_subscription = this.socket_service.createRoom$.subscribe((room: any) => {
        this.room = room;
        this.router.navigate(["room", room.uuid]);
      })
      


      
      
     
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

  ngOnDestroy(){
    this.usersOnline_subscription.unsubscribe();
    this.createRoom_subscription.unsubscribe();
  }

}
