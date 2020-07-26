import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service'
@Component({
  selector: 'app-filebox',
  templateUrl: './filebox.component.html',
  styleUrls: ['./filebox.component.css']
})
export class FileboxComponent implements OnInit {

  fileData: File = null;
  constructor(private fileupload: FileUploadService) { }

  ngOnInit(): void {
  }

  fileUpload(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
  }

  uploadFiles() {
    const formData = new FormData();
    formData.append('files', this.fileData);
    //this.fileupload.upload()
  }

}
