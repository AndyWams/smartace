import { Component, OnInit } from '@angular/core';
import { payscalePayrollData, grossPayrollData } from 'src/assets/raw_data';

@Component({
  selector: 'app-quick-payroll',
  templateUrl: './quick-payroll.component.html',
  styleUrls: ['./quick-payroll.component.scss'],
})
export class QuickPayrollComponent implements OnInit {
  runByItem: string = 'Payscale';
  payChannel: string = 'Master';
  data = payscalePayrollData;
  data_ = grossPayrollData;
  constructor() {}

  ngOnInit(): void {}

  handleRunBy(event: any) {
    this.runByItem = event.source._value;
  }
  handlePayChannel(event: any) {
    this.payChannel = event.source._value;
  }
}
