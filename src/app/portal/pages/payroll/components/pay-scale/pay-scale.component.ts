import { Component, OnInit } from '@angular/core';
import { payScaleData } from 'src/assets/raw_data';

@Component({
  selector: 'app-pay-scale',
  templateUrl: './pay-scale.component.html',
  styleUrls: ['./pay-scale.component.scss'],
})
export class PayScaleComponent implements OnInit {
  constructor() {}
  data = payScaleData;
  ngOnInit(): void {}
}
