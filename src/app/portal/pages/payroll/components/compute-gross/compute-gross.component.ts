import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compute-gross',
  templateUrl: './compute-gross.component.html',
  styleUrls: ['./compute-gross.component.scss'],
})
export class ComputeGrossComponent implements OnInit {
  computeType: string = '';
  payPeriods = ['Daily', 'Weekly', 'Monthly', 'Bi-annual'];
  payperiod: string;
  screen: number = 1;
  constructor() {}

  ngOnInit(): void {}

  handdlePayPeriodSelect(event: any) {
    this.payperiod = event.value;
  }
  handdleSalaryTypeSelect(event: any) {
    this.computeType = event.value;
  }
  gotoView(type?: string, index?: number) {
    if (type == 'next') {
      this.screen = this.screen + 1;
    }
    if (type == 'prev') {
      this.screen = this.screen - 1;
    }
    if (index) {
      this.screen = index;
    }
  }
}
