import { BrowserModule } from '@angular/platform-browser';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA } from '@angular/core';
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
import { FileboxComponent } from './components/filebox/filebox.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { PopoverModule } from 'ngx-bootstrap/popover';
import * as $ from "jquery";
import { VideoboxComponent } from './components/videobox/videobox.component';

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
    FileboxComponent,
    VideoboxComponent,
    //ChatvideoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    PickerModule,
    PopoverModule.forRoot()
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true }],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
