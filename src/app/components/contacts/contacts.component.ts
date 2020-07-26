import { Component, OnInit } from '@angular/core';
import { ChatappService } from 'src/app/services/chatapp.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  access_token : any;
  ContactsInfoList : any;
  constructor(private chatappService:ChatappService) { }

  ngOnInit(): void {
    this.access_token = sessionStorage.getItem('access_token');
    this.getContactsInfo();
  }

  getContactsInfo()
  {
     this.chatappService.getParticipants(this.access_token).subscribe(
       response => {
        this.ContactsInfoList = response;
       },error => {
         console.log(error)
       }
     );
  }
}
