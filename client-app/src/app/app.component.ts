import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SocketService } from './services/socket.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  is_auth: boolean;
  username: string;
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

    this.socket_service.login$.subscribe((data: any) => {
      console.log('Login');
      this.is_auth = true;
      this.username = data.username;

    });

    this.socket_service.logout$.subscribe(() => {
      console.log('Logout');
      this.is_auth = false;
    });

    if(!localStorage.getItem('username')){
      this.router.navigate(['login']);
    } else {
      this.username = localStorage.getItem('username');
      this.socket_service.login(this.username);
      
      this.router.navigate(['/online']);
      
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
}
