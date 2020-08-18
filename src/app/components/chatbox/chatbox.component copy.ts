// import { Component, OnInit, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
// import { ChatappService } from '../../services/chatapp.service';
// import { CommonutilsService } from '../../services/commonutils.service';
// import { Router } from '@angular/router';
// import { appConfig } from 'src/app/utils/app-config';
// import { WebsocketService } from '../../services/websocket.service'
// import { emojis } from '@ctrl/ngx-emoji-mart/ngx-emoji';
// import { v4 as uId } from 'uuid';


// declare var SockJS;
// declare var Stomp;
// declare var conn: any;
// declare var peerConnection: any;
// declare var stompClient: any;
// declare var Peer:any;

// @Component({
//   selector: 'app-chatbox',
//   templateUrl: './chatbox.component.html',
//   styleUrls: ['./chatbox.component.css'],
//   encapsulation: ViewEncapsulation.None,
// })

// export class ChatboxComponent implements OnInit {
//   message: any;
//   participantsList: any;
//   chatList: any;
//   conversations: any;
//   chatUsername: any;
//   currentUser_id: string;
//   access_token: any;
//   dp_path: string;
//   chatBoxinput: any;
//   public that: any
//   receiver: any;
//   receiver_Obj: any;
//   user_Id = sessionStorage.getItem('user_Id');
//   payload = {
//     text: this.chatBoxinput, sender_id: '', receiver_id: '',
//     chat_id: '', msg_Type: '', groupChatId: '', singleChatId: '',
//     senderName: '', receiverName: '', datachannel: {
//       event: '', data: '', pc1: null
//     }
//   };


//   localVideo: any;
//   remoteVideos: any;
//   peerConnections = {};

//   room = !location.pathname.substring(1) ? 'home' : location.pathname.substring(1);
//   getUserMediaAttempts = 5;
//   gettingUserMedia = false;
//   constraints = {
//     // audio: true,
//     video: { facingMode: "user" }
//   };

//   config = {
//     'iceServers': [{
//       'urls': ['stun:stun.l.google.com:19302']
//     }]
//   };
//   peer :any;
//   ioConnection: any;
//   constructor(private chatAppService: ChatappService, private commonUtils: CommonutilsService, private router: Router,
//     private ws: WebsocketService) {
//     this.initializeWebSocketConnection();
//     this.currentUser_id = sessionStorage.getItem('user_id');
//   }

//   public stompClient;
//   public msg = [];
//   public servers = null;

//   ngOnInit() {
//     this.access_token = sessionStorage.getItem('access_token');
//     this.dp_path = "assets/img/" + sessionStorage.getItem('dp_path');
//     this.currentUser_id = sessionStorage.getItem('user_id');
//     this.LoadData();
//     const externalScriptArray = [
//       //'assets/js/socket.io.js',
//       //'assets/js/video.js',
//       //'assets/js/webrtc.js'
//       'assets/js/zoomclone.js'
//     ];
//     console.log('preparing to load...')
//     for (let i = 0; i < externalScriptArray.length; i++) {
//       const node = document.createElement('script');
//       node.src = externalScriptArray[i];;
//       node.type = 'text/javascript';
//       node.async = false;
//       node.charset = 'utf-8';
//       document.getElementsByTagName('body')[0].appendChild(node);
//     }
//     this.peer = new Peer(sessionStorage.getItem('user_Name')+'_'+ this.currentUser_id);
//     console.log(this.peer);
    
//   }


//   LoadData() {
//     this.chatAppService.getParticipants(this.access_token).subscribe(response => {
//       console.log("participants list loaded");
//       this.participantsList = response;
//     });

//     this.chatAppService.getChatList(this.access_token).subscribe(response => {
//       console.log("chat list loaded");
//       this.chatList = response;
//     });
//     $(".direct-chat").removeClass("direct-chat-contacts-open");
//   }

//   getConvo(chat_id) {
//     // this.currentUser_chatid=chat_id.chatId;
//     this.preloader();
//     this.chatAppService.getConversation(this.access_token, chat_id).subscribe(
//       response => {
//         this.conversations = response;
//         this.payload.senderName = this.conversations.Conversation.senderName;
//         this.payload.receiverName = this.conversations.Conversation.receiverName;
//         this.receiver = this.conversations.Conversation.Receiver;
//         this.conversations = this.conversations.Conversation.chats;

//         $(".direct-chat").removeClass("direct-chat-contacts-open");
//       });
//     $(".card-title").html(chat_id.name);
//     this.receiver = chat_id;  //copying  chat_id to receiver
//     this.payload.chat_id = chat_id; // setting the chat id in payload for send msg();
//     setTimeout(this.scrollerheight, 50);
//   }


//   sendmsg() {
//     console.log("cnchjgvj " + this.payload)
//     this.payload.text = this.chatBoxinput;
//     this.stompClient.send('/app/send/message', {}, JSON.stringify(this.payload));
//     this.chatBoxinput = "";
//   }

//   //websocket Injection
//   initializeWebSocketConnection() {
//     const serverUrl = appConfig.apiUrl + '/socket';
//     const ws = new SockJS(serverUrl);
//     this.stompClient = Stomp.over(ws);

//     const that = this;
//     // tslint:disable-next-line:only-arrow-functions
//     this.stompClient.connect({}, function (connect) {
//       console.log("webSocket Connection : " + connect);
//       that.stompClient.subscribe('/message', (message) => {
//         if (message.body) {
//           console.log(message.body)
//           //{"text":"hey h r u","sender_id":1,"receiver_id":2,"chat_id":1,"msg_Type":0,"groupChatId":"","singleChatId":""}
//           var resultJSON = JSON.parse(message.body);
//           this.receiver = resultJSON.receiver_id;

//           var chatthread = '<div class="box-body chat" id="chat-box"><div class="item">';
//           chatthread += ' <img src="assets/img/' + sessionStorage.getItem('dp_path') + '" alt="user image" class="online"/>';
//           chatthread += ' <p class="message">';
//           chatthread += '   <a href="javascript:void(0)" class="name">';
//           var dt = resultJSON.createdTime;
//           const options = { year: 'numeric', month: 'short', day: 'numeric' };
//           chatthread += '     <small class="text-muted pull-right"><i  class="fa fa-clock-o"></i>' + new Date(dt).toLocaleDateString('en-IN', options) + '</small>';
//           chatthread += resultJSON.SentByName + ' </a> ' + resultJSON.Message + '  </p>';
//           if (resultJSON.files) {
//             chatthread += ' <div class="attachment" *ngIf="this.convo.files">';
//             chatthread += '   <h4>Attachments:</h4>';
//             chatthread += '  <p class="filename">   Theme-thumbnail-image.jpg </p>';
//             chatthread += '   <div class="pull-right">';
//             chatthread += '      <button type="button" class="btn btn-primary btn-sm btn-flat">Open</button>';
//             chatthread += '   </div>';
//             chatthread += ' </div>';
//           }
//           chatthread += '</div></div>';


//           $(".direct-chat-messages").append(chatthread);
//         }
//         $(".direct-chat-messages").scrollTop($(".direct-chat-messages")[0].scrollHeight);
//       });

//       that.stompClient.subscribe('/typing', (message) => {
//         console.log(sessionStorage.getItem('user_Id') + "  " + JSON.parse(message.body).sender_id)
//         if (sessionStorage.getItem('user_id') != JSON.parse(message.body).sender_id) {
//           $("#typing").html(JSON.parse(message.body).senderName + ' is typing...').fadeIn(500).fadeOut(10);
//         }
//       });


//     });
//   }

//   scrollerheight() {
//     $(".direct-chat-messages").scrollTop($(".direct-chat-messages")[0].scrollHeight);
//   }
//   preloader() {
//     $("#preloader").attr("class", "show");
//     var value = function () {
//       $("#preloader").attr("class", "hide")
//     }
//     setTimeout(value, 100);
//   }


//   fileuploadinit() {
//     $("#chatbox-fileupload").trigger("click");
//   }

//   addemoji($event) {
//     this.chatBoxinput = this.chatBoxinput == undefined ? '' : this.chatBoxinput.trim();
//     this.chatBoxinput += $event.emoji.native;
//   }

//   typingEvent(event) {
//     this.stompClient.send('/app/send/typing', {}, JSON.stringify(this.payload));
//   }

//   //****------socket IO ---------****//


//   initVideo() {

//     this.localVideo = document.getElementById('localVideo');
//     this.remoteVideos = document.querySelector('.remoteVideos');
//     this.peerConnections = {};

//     this.room = !location.pathname.substring(1) ? 'home' : location.pathname.substring(1);
//     this.getUserMediaAttempts = 5;
//     this.gettingUserMedia = false;
//     const temp_socket = this.ws;
//     /** @type {RTCConfiguration} */
    

//     /** @type {MediaStreamConstraints} */
//     const constraints = {
//       // audio: true,
//       video: { facingMode: "user" }
//     };

//     this.getUserMediaDevices();
//   }

//   getUserMediaSuccess(stream) {
//     //this.gettingUserMedia = false;
//     if (this.localVideo instanceof HTMLVideoElement) {
//       !this.localVideo.srcObject && (this.localVideo.srcObject = stream);
//     }
//     this.ws.emit('ready','','');
//     const that = this;
//     this.ws.socket.on('ready', function (id) {
//       alert('component :: ' + id);
//       const peerConnection = new RTCPeerConnection();
//       that.peerConnections[id] = peerConnection;
//       peerConnection.createOffer()
//       .then(sdp => peerConnection.setLocalDescription(sdp))
//       .then(function() {
//         that.ws.emit('offer',id,peerConnection.localDescription);
//       });
//       stream.getTracks().forEach(function(track) {
//         peerConnection.addTrack(track, stream);
//       });
//       peerConnection.onicecandidate = function (event) {
//         if(event.candidate) {
//           that.ws.emit('candidate',id,event.candidate)
//         }
//       }
//     });
//     this.handleOffer(that);
//     this.handleCandidate(that)
    
//   }

//   handleOffer(that){
//     const tempthis= that;
//     that.ws.socket.on('offer', function(id,description){
//       alert('comp :: '+ id+ ' '+ description);
//       const peerConnection = new RTCPeerConnection(this.config);
//       tempthis.peerConnections[id] = peerConnection;

//       peerConnection.setRemoteDescription(description)
//       .then(() => peerConnection.createAnswer())
//       .then(sdp => peerConnection.setLocalDescription(sdp))
//       .then(function () {
//         tempthis.ws.emit('answer',id, peerConnection.localDescription)
//       });
//       peerConnection.onicecandidate = function (event) {
//         if(event.candidate) {
//           that.ws.emit('candidate',id,event.candidate)
//         }
//       }
//       tempthis.ws.socket.on('answer', function(id, description) {
//         tempthis.peerConnections[id].setRemoteDescription(description);
//       });

//     })
//   }

//   handleCandidate(that){
//     that.ws.socket.on('candidate', function(id, candidate) {
//       alert('comp :: '+ id+ ' '+ candidate);
//       this.peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate))
//       .catch(e => console.error(e));
//     });
//   }

//   handleRemoteStreamAdded(stream, id) {
//     const remoteVideo = document.createElement('video');
//     remoteVideo.srcObject = stream;
//     remoteVideo.setAttribute("id", id.replace(/[^a-zA-Z]+/g, "").toLowerCase());
//     remoteVideo.setAttribute("playsinline", "true");
//     remoteVideo.setAttribute("autoplay", "true");
//     this.remoteVideos.appendChild(remoteVideo);
//     if (this.remoteVideos.querySelectorAll("video").length === 1) {
//       this.remoteVideos.setAttribute("class", "one remoteVideos");
//     } else {
//       this.remoteVideos.setAttribute("class", "remoteVideos");
//     }
//   }

//   getUserMediaError(error) {
//     console.error(error);
//     this.gettingUserMedia = false;
//     (--this.getUserMediaAttempts > 0) && setTimeout(this.getUserMediaDevices, 1000);
//   }

//   getUserMediaDevices() {
//     if (this.localVideo instanceof HTMLVideoElement) {
//       if (this.localVideo.srcObject) {
//         this.getUserMediaSuccess(this.localVideo.srcObject);
//       } else if (!this.gettingUserMedia && !this.localVideo.srcObject) {
//         this.gettingUserMedia = true;
//         navigator.mediaDevices.getUserMedia(this.constraints)
//           .then(this.getUserMediaSuccess.bind(this))
//           .catch(this.getUserMediaError);
//       }
//     }
//   }

//   handleRemoteHangup(id) {
//     this.peerConnections[id] && this.peerConnections[id].close();
//     delete this.peerConnections[id];
//     document.querySelector("#" + id.replace(/[^a-zA-Z]+/g, "").toLowerCase()).remove();
//     if (this.remoteVideos.querySelectorAll("video").length === 1) {
//       this.remoteVideos.setAttribute("class", "one remoteVideos");
//     } else {
//       this.remoteVideos.setAttribute("class", "remoteVideos");
//     }
//   }


//   initIoConnection(): void {
//     this.ws.initSocket(sessionStorage.getItem('user_Name')+'_'+ this.currentUser_id);
//   }

// }