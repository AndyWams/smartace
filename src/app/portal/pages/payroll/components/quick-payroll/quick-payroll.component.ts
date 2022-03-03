import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quick-payroll',
  templateUrl: './quick-payroll.component.html',
  styleUrls: ['./quick-payroll.component.scss'],
})
export class QuickPayrollComponent implements OnInit {
  runByItem: string = 'Payscale';
  payChannel: string = 'Master';
  constructor() {}

  ngOnInit(): void {}

  handleRunBy(event: any) {
    this.runByItem = event.target.value;
  }
  handlePayChannel(event: any) {
    this.payChannel = event.target.value;
  }
}
