import { Component, OnInit } from '@angular/core';
import { payElementData } from 'src/assets/raw_data';

@Component({
  selector: 'app-pay-elements',
  templateUrl: './pay-elements.component.html',
  styleUrls: ['./pay-elements.component.scss'],
})
export class PayElementsComponent implements OnInit {
  data = payElementData;
  constructor() {}

  ngOnInit(): void {}
}
