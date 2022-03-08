import { Component, OnInit } from '@angular/core';
import {
  allElementReport,
  bankScheduleReport,
  deductionReport,
  earningReport,
  payslipAnalysisReport,
  pensionDetailReport,
  summaryReport,
  taxDetailReport,
} from 'src/assets/raw_data';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  data: any;
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
    this.data = this.getDataSource(this.reportType);
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
  getReportType = (reportType: string) => {
    let result: string[] = [];
    let someReports = {
      'Bank Schedule Report': [
        'name',
        'scId',
        'department',
        'bank',
        'accountNo',
        'earnings',
        'deductions',
        'netPay',
      ],
      'Earning Report': [
        'name',
        'scId',
        'department',
        'location',
        'leave',
        'bonus',
        'others',
      ],
      'Deduction Report': [
        'name',
        'scId',
        'department',
        'location',
        'cooperative',
        'loan',
        'others',
      ],
      'All Element Sheet Report': [
        'name',
        'scId',
        'department',
        'location',
        'cooperative',
        'loan',
        'leave',
      ],
      'Deduction Summary Report': [
        'name',
        'scId',
        'department',
        'location',
        'cooperative',
        'loan',
        'leave',
      ],
      'Payment Summary Report': ['elementName', 'amount', 'location'],
      'Tax Details Report': ['name', 'scId', 'taxId'],
      'Pension Details Report': [
        'name',
        'scId',
        'pfaCode',
        'pfaName',
        'pensionPin',
        'periodName',
        'employeeContribution',
        'employerContribution',
        'remittance',
      ],
      'Payslip Analysis Report': [
        'name',
        'empId',
        'totalCurrentEarning',
        'totalCurrentEarning',
        'totalPreviousEarning',
        'percentageEarningDiff',
        'totalCurrentDeduction',
      ],
    };

    if (someReports.hasOwnProperty(reportType)) {
      result = someReports[reportType];
    }
    return result;
  };

  getDataSource(repType: string) {
    let _data: any;
    switch (repType) {
      case (repType = 'Bank Schedule Report'):
        return (_data = bankScheduleReport);
      case (repType = 'Earning Report'):
        return (_data = earningReport);
      case (repType = 'Deduction Report'):
        return (_data = deductionReport);
      case (repType = 'All Element Sheet Report'):
        return (_data = allElementReport);
      case (repType = 'Deduction Summary Report'):
        return (_data = summaryReport);
      case (repType = 'Payment Summary Report'):
        return (_data = summaryReport);
      case (repType = 'Tax Details Report'):
        return (_data = taxDetailReport);
      case (repType = 'Pension Details Report'):
        return (_data = pensionDetailReport);
      case (repType = 'Payslip Analysis Report'):
        return (_data = payslipAnalysisReport);
    }
    return _data;
  }
}
