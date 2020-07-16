import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonutilsService } from 'src/app/services/commonutils.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatappService } from 'src/app/services/chatapp.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  user_Name: string;
  dp_path: string;
  access_token: any;
  userList: any;
  currentUser_id: any;
  selected_receiver: any;
  @Output() messageEvent = new EventEmitter<any>();
  
  constructor(private commUtils: CommonutilsService, private domSanitizer: DomSanitizer,
    private chatAppService: ChatappService) {

  }

  ngOnInit(): void {
    this.user_Name = sessionStorage.getItem('user_Name');
    this.currentUser_id = sessionStorage.getItem('user_id');
    this.dp_path = "assets/img/" + sessionStorage.getItem('dp_path');
    this.load_participants();
  }

  load_participants() {
    this.access_token = sessionStorage.getItem('access_token');
    this.chatAppService.getParticipants(this.access_token).subscribe(response => {
      console.log("participants list loaded");
      this.userList = response;
    });
  }

  createChat(with_user_Id) {
    this.chatAppService.setReceiverObj(with_user_Id);
    this.selected_receiver = with_user_Id;
    this.messageEvent.emit(this.selected_receiver);
  }
}
