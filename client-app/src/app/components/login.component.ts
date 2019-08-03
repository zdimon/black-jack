import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from "@angular/router";
import { SocketService } from '../services/socket.service';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-login-form',
  template: `
  <ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-menu-button></ion-menu-button>
    </ion-buttons>
    <ion-title>
      Login
    </ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-list>
      <ion-item>
      <ion-label>What is your name?</ion-label>
      </ion-item>
      <ion-item>
        <ion-input [(ngModel)]="username" type="text" name="username"></ion-input>
      </ion-item>
    </ion-list>
    <ion-button (click)="login(username.value)" color="primary" expand="full">Signin</ion-button>
  </ion-content>
   

  `,
  styles: ['ion-input {border: 1px solid silver}']
})
export class LoginComponent implements OnInit {
  username: string;
  is_auth: boolean = false;
  login_subscription: Subscription;
  constructor(private router: Router, private socket_service: SocketService){
  }

  ngOnInit(){
    if(localStorage.getItem('username')){
      this.router.navigate(['/online']);
    }

    this.login_subscription = this.socket_service.checkLoginResult$.subscribe((data: any) => {
      if(data.status===1) {
        localStorage.removeItem('username');
        alert(data.message);
      } else {
       localStorage.setItem('username',this.username);
       this.socket_service.login(this.username);
       this.router.navigate(['online']);
      }

    });
  }

  login(username: string){
    localStorage.setItem('username', this.username);
    this.socket_service.checkLogin(username);
  }

  ngOnDestroy() {
    this.login_subscription.unsubscribe();
  }

}
