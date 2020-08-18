import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { appConfig } from '../utils/app-config';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChatappService {

  messageSource: any;
  constructor(private http: HttpClient) {
    //this.initializeWebSocketConnection();
  }
  getParticipants(token: any) {
    return this.http.get(appConfig.apiUrl + '/webapi/getparticipants?access_token=' + token);
  }

  getChatList(token: any) {
    return this.http.get(appConfig.apiUrl + '/webapi/getChatList?access_token=' + token);
  }

  getConversation(token: any, chat_id) {
    return this.http.post(appConfig.apiUrl + '/webapi/getConversation?+&access_token=' + token + '&chatId=' + chat_id, "");
  }
  uploadDocument(token: any, formData, user_id) {
    return this.http.post(appConfig.apiUrl + '/webapi/uploadDoc?access_token=' + token + '&userId=' + user_id, formData, {reportProgress: true,observe: 'events'});
  }

  setReceiverObj(Obj: any) {
    this.messageSource = Obj;
  }

  getReceiverObj() {
    return this.messageSource;
  }

}
