import { Component, OnInit, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ChatappService } from '../../services/chatapp.service';
import { CommonutilsService } from '../../services/commonutils.service';
import { Router } from '@angular/router';
import { appConfig } from 'src/app/utils/app-config';
import { WebsocketService } from '../../services/websocket.service'
import { emojis } from '@ctrl/ngx-emoji-mart/ngx-emoji';

declare var SockJS;
declare var Stomp;
declare var ws;
//var Rtcpeer = require('rtcpeerconnection');

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css'],
  encapsulation: ViewEncapsulation.None,
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
    chat_id: '', msg_Type: '', groupChatId: '', singleChatId: '',
    senderName:'',receiverName:''
  };
  pc1: any;
  pc2: any;
  localStream: any;
  callButtonDisabled: boolean;
  startButtonDisabled: boolean;
  hangupButtonDisabled: boolean;
  startTime: number;

  @ViewChild('startButton') startButton: ElementRef;
  @ViewChild('callButton') callButton: ElementRef;
  @ViewChild('hangupButton') hangupButton: ElementRef;
  @ViewChild('localVideo') localVideo: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;

  constructor(private chatAppService: ChatappService, private commonUtils: CommonutilsService, private router: Router,
    private ws: WebsocketService) {
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
        this.payload.senderName = this.conversations.Conversation.senderName;
        this.payload.receiverName = this.conversations.Conversation.receiverName;
        this.receiver = this.conversations.Conversation.Receiver;
        this.conversations = this.conversations.Conversation.chats;
       
        $(".direct-chat").removeClass("direct-chat-contacts-open");
      });
    $(".card-title").html(chat_id.name);
    this.receiver = chat_id;  //copying  chat_id to receiver
    this.payload.chat_id = chat_id; // setting the chat id in payload for send msg();
    setTimeout(this.scrollerheight, 50);
  }


  sendmsg() {
    console.log("cnchjgvj "+this.payload)
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
          this.receiver = resultJSON.receiver_id;

          var chatthread = '<div class="box-body chat" id="chat-box"><div class="item">';
          chatthread += ' <img src="assets/img/' + sessionStorage.getItem('dp_path') + '" alt="user image" class="online"/>';
          chatthread += ' <p class="message">';
          chatthread += '   <a href="javascript:void(0)" class="name">';
          var dt = resultJSON.createdTime;
          const options = { year: 'numeric', month: 'short', day: 'numeric' };
          chatthread += '     <small class="text-muted pull-right"><i  class="fa fa-clock-o"></i>' + new Date(dt).toLocaleDateString('en-IN', options) + '</small>';
          chatthread += resultJSON.SentByName + ' </a> ' + resultJSON.Message + '  </p>';
          if (resultJSON.files) {
            chatthread += ' <div class="attachment" *ngIf="this.convo.files">';
            chatthread += '   <h4>Attachments:</h4>';
            chatthread += '  <p class="filename">   Theme-thumbnail-image.jpg </p>';
            chatthread += '   <div class="pull-right">';
            chatthread += '      <button type="button" class="btn btn-primary btn-sm btn-flat">Open</button>';
            chatthread += '   </div>';
            chatthread += ' </div>';
          }
          chatthread += '</div></div>';


          // var chatthread = ' <div class="' + div1 + '"><div class="direct-chat-infos clearfix">';
          // chatthread += '<span class="' + spandiv1 + ' direct-chat-name">' + resultJSON.SentByName + '</span>';
          // //var chatthread = ' <div [ngClass]="' + resultJSON.SentBy + ' == ' + sessionStorage.getItem('user_id')  + '? \'direct-chat-msg right\':\'direct-chat-msg\'"><div class="direct-chat-infos clearfix">';
          // //chatthread += '<span [ngClass]="' + resultJSON.SentBy + ' == ' + sessionStorage.getItem('user_id')  + ' ? \'float-right\' : \'float-left\'" class="direct-chat-name">' + resultJSON.SentByName + '</span>';
          // chatthread += '<span';
          // var dt = resultJSON.createdTime;
          // const options = { year: 'numeric', month: 'short', day: 'numeric' };
          // chatthread += ' class="' + spandiv2 + '">' + new Date(dt).toLocaleDateString('en-IN', options) + '</span>';
          // //chatthread += '[ngClass]="{ \'float-left\' : ' + resultJSON.SentBy + ' == ' + sessionStorage.getItem('user_id')  + ' ,\'float-right\' : ' + resultJSON.SentBy + ' != ' + sessionStorage.getItem('user_id')  + ' }">{{' + resultJSON.createdTime + '|date:\'medium\'}}</span>';
          // chatthread += '</div>';
          // chatthread += '<img class="direct-chat-img" src="assets/img/' + sessionStorage.getItem('dp_path') +'" alt="message user image">';
          // chatthread += '<div class="direct-chat-text">';
          // chatthread += resultJSON.Message;
          // chatthread += '</div>';
          // chatthread += '</div>';
          $(".direct-chat-messages").append(chatthread);
        }
        $(".direct-chat-messages").scrollTop($(".direct-chat-messages")[0].scrollHeight);
      });

      that.stompClient.subscribe('/typing', (message) => {
        console.log(sessionStorage.getItem('user_Id')+"  "+JSON.parse(message.body).sender_id)
        if(sessionStorage.getItem('user_id')!=JSON.parse(message.body).sender_id){
          $("#typing").html(JSON.parse(message.body).senderName+' is typing...').fadeIn(500).fadeOut(10);
        }
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


  fileuploadinit() {
    $("#chatbox-fileupload").trigger("click");
  }

  addemoji($event) {
    this.chatBoxinput = this.chatBoxinput == undefined ? '' : this.chatBoxinput.trim();
    this.chatBoxinput += $event.emoji.native;
  }

  typingEvent(event) {
    this.stompClient.send('/app/send/typing', {}, JSON.stringify(this.payload));
  }


  // ****************** webrtc *************************

  getName(pc) {
    return (pc === this.pc1) ? 'pc1' : 'pc2';
  }

  getOtherPc(pc) {
    return (pc === this.pc1) ? this.pc2 : this.pc1;
  }

  gotStream(stream) {
    this.trace('Received local stream');
    this.localVideo.nativeElement.srcObject = stream;
    this.localStream = stream;
    this.callButtonDisabled = false;
    this.call();
  }

  start() {
    this.trace('Requesting local stream');
    this.startButtonDisabled = true;
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true
    })
      .then(this.gotStream.bind(this))
      .catch(function (e) {
        alert('getUserMedia() error: ' + e.name);
      });
  }

  call() {
    this.callButtonDisabled = true;
    this.hangupButtonDisabled = false;
    this.trace('Starting call');
    this.startTime = window.performance.now();
    var videoTracks = this.localStream.getVideoTracks();
    var audioTracks = this.localStream.getAudioTracks();
    if (videoTracks.length > 0) {
      this.trace('Using video device: ' + videoTracks[0].label);
    }
    if (audioTracks.length > 0) {
      this.trace('Using audio device: ' + audioTracks[0].label);
    }
    var servers = null;
    this.pc1 = new RTCPeerConnection(servers);
    this.trace('Created local peer connection object pc1');
    this.pc1.onicecandidate = e => {
      this.onIceCandidate(this.pc1, e);
    };
    this.pc2 = new RTCPeerConnection(servers);
    this.trace('Created remote peer connection object pc2');
    this.pc2.onicecandidate = e => {
      this.onIceCandidate(this.pc2, e);
    };
    this.pc1.oniceconnectionstatechange = e => {
      this.onIceStateChange(this.pc1, e);
    };
    this.pc2.oniceconnectionstatechange = e => {
      this.onIceStateChange(this.pc2, e);
    };
    this.pc2.ontrack = this.gotRemoteStream.bind(this);

    this.localStream.getTracks().forEach(
      track => {
        this.pc1.addTrack(
          track,
          this.localStream
        );
      }
    );
    this.trace('Added local stream to pc1');

    this.trace('pc1 createOffer start');
    this.pc1.createOffer(
      this.offerOptions
    ).then(
      this.onCreateOfferSuccess.bind(this),
      this.onCreateSessionDescriptionError.bind(this)
    );
  }
  offerOptions(offerOptions: any) {
    throw new Error("Method not implemented.");
  }

  onCreateSessionDescriptionError(error) {
    this.trace('Failed to create session description: ' + error.toString());
  }

  onCreateOfferSuccess(desc) {
    this.trace('Offer from pc1\n' + desc.sdp);
    this.trace('pc1 setLocalDescription start');
    this.pc1.setLocalDescription(desc).then(
      () => {
        this.onSetLocalSuccess(this.pc1);
      },
      this.onSetSessionDescriptionError.bind(this)
    );
    this.trace('pc2 setRemoteDescription start');
    this.pc2.setRemoteDescription(desc).then(
      () => {
        this.onSetRemoteSuccess(this.pc2);
      },
      this.onSetSessionDescriptionError.bind(this)
    );
    this.trace('pc2 createAnswer start');
    // Since the 'remote' side has no media stream we need
    // to pass in the right constraints in order for it to
    // accept the incoming offer of audio and video.
    this.pc2.createAnswer().then(
      this.onCreateAnswerSuccess.bind(this),
      this.onCreateSessionDescriptionError.bind(this)
    );
  }

  onSetLocalSuccess(pc) {
    this.trace(this.getName(pc) + ' setLocalDescription complete');
  }

  onSetRemoteSuccess(pc) {
    this.trace(this.getName(pc) + ' setRemoteDescription complete');
  }

  onSetSessionDescriptionError(error) {
    this.trace('Failed to set session description: ' + error.toString());
  }

  gotRemoteStream(e) {
    if (this.remoteVideo.nativeElement.srcObject !== e.streams[0]) {
      this.remoteVideo.nativeElement.srcObject = e.streams[0];
      this.trace('pc2 received remote stream');
    }
  }

  onCreateAnswerSuccess(desc) {
    this.trace('Answer from pc2:\n' + desc.sdp);
    this.trace('pc2 setLocalDescription start');
    this.pc2.setLocalDescription(desc).then(
      () => {
        this.onSetLocalSuccess(this.pc2);
      },
      this.onSetSessionDescriptionError.bind(this)
    );
    this.trace('pc1 setRemoteDescription start');
    this.pc1.setRemoteDescription(desc).then(
      () => {
        this.onSetRemoteSuccess(this.pc1);
      },
      this.onSetSessionDescriptionError.bind(this)
    );
  }

  onIceCandidate(pc, event) {
    this.getOtherPc(pc).addIceCandidate(event.candidate)
      .then(
        () => {
          this.onAddIceCandidateSuccess(pc);
        },
        (err) => {
          this.onAddIceCandidateError(pc, err);
        }
      );
    this.trace(this.getName(pc) + ' ICE candidate: \n' + (event.candidate ?
      event.candidate.candidate : '(null)'));
  }

  onAddIceCandidateSuccess(pc) {
    this.trace(this.getName(pc) + ' addIceCandidate success');
  }

  onAddIceCandidateError(pc, error) {
    this.trace(this.getName(pc) + ' failed to add ICE Candidate: ' + error.toString());
  }

  onIceStateChange(pc, event) {
    if (pc) {
      this.trace(this.getName(pc) + ' ICE state: ' + pc.iceConnectionState);
      console.log('ICE state change event: ', event);
    }
  }

  hangup() {
    this.trace('Ending call');
    this.pc1.close();
    this.pc2.close();
    this.pc1 = null;
    this.pc2 = null;
    this.hangupButtonDisabled = true;
    this.callButtonDisabled = false;
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: false
    })
  }

  trace(arg) {
    var now = (window.performance.now() / 1000).toFixed(3);
    console.log(now + ': ', arg);
  }


}
