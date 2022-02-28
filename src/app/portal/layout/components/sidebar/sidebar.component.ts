import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  _isOpen: boolean = false;
  constructor() {}

  ngOnInit(): void {}
  toggleSnap() {
    this._isOpen = !this._isOpen;
  }
}
