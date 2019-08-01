import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { SocketService } from '../services/socket.service';

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
        <ion-input #username type="text" name="username"></ion-input>
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
  constructor(private router: Router, private socket_service: SocketService){
  }

  ngOnInit(){
    if(localStorage.getItem('username')){
      this.router.navigate(['/online']);
    }

    this.socket_service.checkLoginResult$.subscribe((data: any) => {
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
    this.username = username;
    this.socket_service.checkLogin(username);
  }

}
