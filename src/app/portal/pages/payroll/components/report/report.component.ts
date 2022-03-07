import { Component, OnInit } from '@angular/core';
import { payslipAnalysis } from 'src/assets/raw_data';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  data = payslipAnalysis;
  reportMode: string = 'Period';
  reportType: string = '';
  screen: number = 1;
  _reports: string[] = [
    'Bank Schedule Report',
    'Earning Report',
    'Deduction Report',
    'All Element Sheet Report',
    'Deduction Summary Report',
    'Payment Summary Report',
    'Tax Details Report',
    'Pension Details Report',
    'Payslip Analysis Report',
  ];
  constructor() {}

  ngOnInit(): void {}
  handleReportSelect(event: any) {
    this.reportType = event.source._value;
  }
  handleReportMode(event: any) {
    this.reportMode = event.value;
  }
  gotoView(type: string) {
    if (type == 'next') {
      this.screen = this.screen + 1;
    }
    if (type == 'prev') {
      this.screen = this.screen - 1;
    }
  }
}
