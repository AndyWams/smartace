import { Component, OnInit } from '@angular/core';
import { pensionData } from 'src/assets/raw_data';

@Component({
  selector: 'app-payroll-settings',
  templateUrl: './payroll-settings.component.html',
  styleUrls: ['./payroll-settings.component.scss'],
})
export class PayrollSettingsComponent implements OnInit {
  data = pensionData;
  screen: number = 1;
  constructor() {}

  ngOnInit(): void {}
  handleSlideToggle(event: any) {}
  gotoView(index: number) {
    this.screen = index;
  }
}
