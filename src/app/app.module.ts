import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MyInterceptor } from '../app/utils/Interceptor'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { RegisterComponent } from './components/register/register.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ContactsComponent } from './components/contacts/contacts.component';
//import { ChatvideoComponent } from './chatvideo/chatvideo.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatboxComponent,
    FooterComponent,
    HeaderComponent,
    RegisterComponent,
    MainContentComponent,
    SideNavComponent,
    LoginComponent,
    ContactsComponent,
    //ChatvideoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
