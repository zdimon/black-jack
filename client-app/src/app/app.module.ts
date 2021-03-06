import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './components/login.component';
import { SocketService } from './services/socket.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { UsersOnlineComponent } from './components/users.online.component';

import { TableComponent } from './components/table.component';
import { CardComponent } from './components/card.component';
import { SOCKET_SERVER } from '../global';
import { FormsModule } from '@angular/forms';
const config: SocketIoConfig = { url: SOCKET_SERVER, options: {} };

@NgModule({
  declarations: [AppComponent, LoginComponent, UsersOnlineComponent, TableComponent, CardComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    SocketService,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
