import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SocketService } from './services/socket.service';
import {Router} from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
  is_auth: boolean;
  username: string;
  login_subscription: Subscription;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private socket_service: SocketService,
    private router: Router
  ) {
    this.initializeApp();
  }

  ngOnInit(){
    if(localStorage.getItem('username')){
      this.is_auth = true;
    }

    this.login_subscription = this.socket_service.login$.subscribe((data: any) => {
      console.log('Login');
      console.log(data);
      this.is_auth = true;
      this.username = data.username;

    });

    this.socket_service.logout$.subscribe(() => {
      console.log('Logout');
      this.is_auth = false;
    });

    if(!localStorage.getItem('username')){
      this.router.navigate(['login']);
    } 

  }

  unlogin(username){
    this.socket_service.unlogin(localStorage.getItem('username'));
    localStorage.removeItem('username');
    this.router.navigate(['login']);
  }  

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnDestroy(){
    this.login_subscription.unsubscribe();
  }
}
