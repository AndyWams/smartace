import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  @Input() toggleOpen;
  hide: boolean = false;
  @Output() toggledChange = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    console.log(this.toggleOpen);
  }
  close() {
    this.toggleOpen = !this.toggleOpen;
    console.log('from file', this.toggleOpen);
    this.toggledChange.emit(!this.toggleOpen);
  }
}
