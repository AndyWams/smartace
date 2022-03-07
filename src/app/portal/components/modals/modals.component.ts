import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.scss'],
})
export class ModalsComponent implements OnInit {
  // runByItem: string = 'Payscale';
  @Input() runByItem;

  payChannel: string = 'Master';
  payScale: string = '';

  constructor() {}

  ngOnInit(): void {}

  handlePayAssignee(event: any) {
    this.payScale = event.source._value;
  }
}
