import { Component, OnInit } from '@angular/core';
import { taxData } from 'src/assets/raw_data';

@Component({
  selector: 'app-tax-type',
  templateUrl: './tax-type.component.html',
  styleUrls: ['./tax-type.component.scss'],
})
export class TaxTypeComponent implements OnInit {
  data = taxData;
  constructor() {}

  ngOnInit(): void {}
}
