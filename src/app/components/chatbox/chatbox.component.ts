import { Component, OnInit, ElementRef } from '@angular/core';
import { ChatappService } from '../../services/chatapp.service';
import { CommonutilsService } from '../../services/commonutils.service';
import { Router } from '@angular/router';
import { appConfig } from 'src/app/utils/app-config';
declare var SockJS;
declare var Stomp;
//var Rtcpeer = require('rtcpeerconnection');

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
  receiver: any;
  receiver_Obj: any;
  user_Id = sessionStorage.getItem('user_Id');
  payload = {
    text: this.chatBoxinput, sender_id: '', receiver_id: '',
    chat_id: '', msg_Type: '', groupChatId: '', singleChatId: ''
  };

  constructor(private chatAppService: ChatappService, private commonUtils: CommonutilsService, private router: Router) {
    this.initializeWebSocketConnection();
    this.currentUser_id = sessionStorage.getItem('user_id');
    var mediaConstraints = {
      audio: true,            // We want an audio track
      video: {
        aspectRatio: {
          ideal: 1.333333     // 3:2 aspect is preferred
        }
      }
    };
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
    this.preloader();
    this.chatAppService.getConversation(this.access_token, chat_id).subscribe(
      response => {
        this.conversations = response;
        this.receiver = this.conversations.Conversation.Receiver;
        this.conversations = this.conversations.Conversation.chats;
        $(".direct-chat").removeClass("direct-chat-contacts-open");
      });
    $(".card-title").html(chat_id.name);
    this.receiver = chat_id;
    this.payload.chat_id = chat_id.chatId;
    setTimeout(this.scrollerheight, 50);
  }


  sendmsg() {
    console.log(this.payload)
    this.payload.text = this.chatBoxinput;
    this.stompClient.send('/app/send/message', {}, JSON.stringify(this.payload));
    this.chatBoxinput = "";
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
          //{"text":"hey h r u","sender_id":1,"receiver_id":2,"chat_id":1,"msg_Type":0,"groupChatId":"","singleChatId":""}

          var resultJSON = JSON.parse(message.body);
          var div1, spandiv1, spandiv2;
          if (resultJSON.SentBy == sessionStorage.getItem('user_id')) {
            div1 = "direct-chat-msg right";
            spandiv1 = "float-right";
            spandiv2 = "float-left";
          } else {
            div1 = "direct-chat-msg";
            spandiv1 = "float-left";
            spandiv2 = "float-right";
          }
          var chatthread = ' <div class="' + div1 + '"><div class="direct-chat-infos clearfix">';
          chatthread += '<span class="' + spandiv1 + ' direct-chat-name">' + resultJSON.SentByName + '</span>';
          //var chatthread = ' <div [ngClass]="' + resultJSON.SentBy + ' == ' + sessionStorage.getItem('user_id')  + '? \'direct-chat-msg right\':\'direct-chat-msg\'"><div class="direct-chat-infos clearfix">';
          //chatthread += '<span [ngClass]="' + resultJSON.SentBy + ' == ' + sessionStorage.getItem('user_id')  + ' ? \'float-right\' : \'float-left\'" class="direct-chat-name">' + resultJSON.SentByName + '</span>';
          chatthread += '<span';
          var dt = resultJSON.createdTime;
          const options = { year: 'numeric', month: 'short', day: 'numeric' };
          chatthread += ' class="' + spandiv2 + '">' + new Date(dt).toLocaleDateString('en-IN', options) + '</span>';
          //chatthread += '[ngClass]="{ \'float-left\' : ' + resultJSON.SentBy + ' == ' + sessionStorage.getItem('user_id')  + ' ,\'float-right\' : ' + resultJSON.SentBy + ' != ' + sessionStorage.getItem('user_id')  + ' }">{{' + resultJSON.createdTime + '|date:\'medium\'}}</span>';
          chatthread += '</div>';
          chatthread += '<img class="direct-chat-img" src="' + this.dp_path + '" alt="message user image">';
          chatthread += '<div class="direct-chat-text">';
          chatthread += resultJSON.Message;
          chatthread += '</div>';
          chatthread += '</div>';
          $(".direct-chat-messages").append(chatthread);
        }
        $(".direct-chat-messages").scrollTop($(".direct-chat-messages")[0].scrollHeight);
      });
    });
  }

  scrollerheight() {
    $(".direct-chat-messages").scrollTop($(".direct-chat-messages")[0].scrollHeight);
  }
  preloader() {
    $("#preloader").attr("class", "show");
    var value = function () {
      $("#preloader").attr("class", "hide")
    }
    setTimeout(value, 100);
  }

  connect() {
    var serverUrl;
    var scheme = "ws";

    // If this is an HTTPS connection, we have to use a secure WebSocket
    // connection too, so add another "s" to the scheme.

    if (document.location.protocol === "https:") {
      scheme += "s";
    }
    serverUrl = scheme + "://localhost:8080/socket";

    console.log(`Connecting to server: ${serverUrl}`);
    const connection = new WebSocket(serverUrl, "json");
    connection.onopen = function(evt) {
      alert('connected');
    };
  }
}
