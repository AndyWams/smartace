import { Component, OnInit } from '@angular/core';
import { payrollRunLog } from 'src/assets/raw_data';

@Component({
  selector: 'app-payroll-runlog',
  templateUrl: './payroll-runlog.component.html',
  styleUrls: ['./payroll-runlog.component.scss'],
})
export class PayrollRunlogComponent implements OnInit {
  data = payrollRunLog;
  constructor() {}

  ngOnInit(): void {}
}
