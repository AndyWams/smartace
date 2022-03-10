import { Component, OnInit } from '@angular/core';
import { grossData } from 'src/assets/raw_data';

@Component({
  selector: 'app-gross-netpay',
  templateUrl: './gross-netpay.component.html',
  styleUrls: ['./gross-netpay.component.scss'],
})
export class GrossNetpayComponent implements OnInit {
  data = grossData;
  constructor() {}

  ngOnInit(): void {}
}
