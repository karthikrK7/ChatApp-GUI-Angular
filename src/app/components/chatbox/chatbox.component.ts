import { Component, OnInit, ElementRef } from '@angular/core';
import { ChatappService } from '../../services/chatapp.service';
import { CommonutilsService } from '../../services/commonutils.service';
import { Router } from '@angular/router';
import { appConfig } from 'src/app/utils/app-config';
declare var SockJS;
declare var Stomp;

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {
  message: any;
  participantsList: any;
  chatList: any;
  conversations: any;
  chatUsername: any;
  currentUser_id: string;
  access_token: any;
  dp_path: string;
  chatBoxinput: any;
  that: any
  receiver :any;
  receiver_Obj : any;
  user_Id= sessionStorage.getItem('user_Id');
  payload = {
    text: this.chatBoxinput, sender_id: '', receiver_id: '',
    chat_id: '', msg_Type: '', groupChatId: '', singleChatId: ''
  };
  constructor(private chatAppService: ChatappService, private commonUtils: CommonutilsService, private router: Router) {
    this.initializeWebSocketConnection();
  }

  public stompClient;
  public msg = [];

  ngOnInit() {
    this.access_token = sessionStorage.getItem('access_token');
    this.dp_path = "assets/img/" + sessionStorage.getItem('dp_path');
    this.currentUser_id = sessionStorage.getItem('user_id');
    this.LoadData();
  }

  LoadData() {
    this.chatAppService.getParticipants(this.access_token).subscribe(response => {
      console.log("participants list loaded");
      this.participantsList = response;
    });

    this.chatAppService.getChatList(this.access_token).subscribe(response => {
      console.log("chat list loaded");
      this.chatList = response;
    });
    $(".direct-chat").removeClass("direct-chat-contacts-open");
  }

  getConvo(chat_id) {
   // this.currentUser_chatid=chat_id.chatId;
    this.chatAppService.getConversation(this.access_token, chat_id).subscribe(
      response => {
        this.conversations = response;
        this.receiver = this.conversations.Conversation.Receiver;
        this.conversations = this.conversations.Conversation.chats;
        $(".direct-chat").removeClass("direct-chat-contacts-open");
        
      }
    );
    $(".card-title").html(chat_id.name);
  }
  sendmsg() {
    this.payload.text = this.chatBoxinput;
    this.payload.chat_id = '6';
    this.stompClient.send('/app/send/message', {}, JSON.stringify(this.payload));
  }

  //websocket Injection
  initializeWebSocketConnection() {
    const serverUrl = appConfig.apiUrl + '/socket';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    this.stompClient.connect({}, function (connect) {
      console.log("webSocket Connection : " + connect);
      that.stompClient.subscribe('/message', (message) => {
        if (message.body) {
          console.log(message.body)
        }
      });
    });
  }

}
