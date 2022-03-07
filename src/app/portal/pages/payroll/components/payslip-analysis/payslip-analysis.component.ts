import { Component, OnInit } from '@angular/core';
import { payslipAnalysis } from 'src/assets/raw_data';

@Component({
  selector: 'app-payslip-analysis',
  templateUrl: './payslip-analysis.component.html',
  styleUrls: ['./payslip-analysis.component.scss'],
})
export class PayslipAnalysisComponent implements OnInit {
  data = payslipAnalysis;
  constructor() {}

  ngOnInit(): void {}
}
