import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service'
import { ChatappService } from 'src/app/services/chatapp.service';
import { FormGroup } from '@angular/forms';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
declare var $:any; 
@Component({
  selector: 'app-filebox',
  templateUrl: './filebox.component.html',
  styleUrls: ['./filebox.component.css']
})
export class FileboxComponent implements OnInit {
  access_token: any;
  progress: number = 0;
  uploadedFiles: any;
  currentUser_id: string;
  currentFile: File;
  message: string;
  fileInfos: any;
  constructor(private chatAppService: ChatappService, private fileupload: FileUploadService) { }

  ngOnInit(): void {
    this.access_token = sessionStorage.getItem('access_token');
    this.currentUser_id = sessionStorage.getItem('user_id');
  }

  fileUpload(event) {
    this.uploadedFiles = event.target.files;
    console.log(this.uploadedFiles);
    

  }

  uploadFiles() {
    this.progress = 0;
    this.currentFile = this.uploadedFiles.item(0);
    const formData= new FormData();
    formData.append("file", this.currentFile);
    console.log(formData)
    var user_id = 1;
    this.chatAppService.uploadDocument(this.access_token, formData, this.currentUser_id).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
          $(".progress-bar progress-bar-primary progress-bar-striped").width(this.progress);
        } else if (event instanceof HttpResponse) {
         
        }
      },
      err => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        this.currentFile = undefined;
      });
  }

}
