import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatboxComponent } from '../chatbox/chatbox.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { HeaderComponent } from '../header/header.component';
import { CommonutilsService } from 'src/app/services/commonutils.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css']
})
export class MainContentComponent implements OnInit {
  receiver_obj: any;

  @ViewChild(ChatboxComponent)
  chatbox: ChatboxComponent;

  //@ViewChild(SideNavComponent)
  //sidenav: SideNavComponent;

  //@ViewChild(HeaderComponent)
  //header: HeaderComponent;
  currentUserId :string;
  constructor() { }

  ngOnInit(): void {
    this.currentUserId = sessionStorage.getItem('user_id');
  }

  receiveMessage($event: any) {
    this.receiver_obj = $event;
    this.chatbox.receiver_Obj = this.receiver_obj;
    this.chatbox.chatUsername = this.receiver_obj.username;
    this.chatbox.payload.sender_id = this.currentUserId;
    this.chatbox.payload.receiver_id = this.receiver_obj.uid;
    console.log(this.receiver_obj);
  }

}
