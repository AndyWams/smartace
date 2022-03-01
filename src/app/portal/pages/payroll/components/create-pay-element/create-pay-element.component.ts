import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-pay-element',
  templateUrl: './create-pay-element.component.html',
  styleUrls: ['./create-pay-element.component.scss'],
})
export class CreatePayElementComponent implements OnInit {
  predefinedPaymentMode: string = 'predefined';
  taxMode: string = 'default';
  _isChecked: boolean = false;
  constructor() {}

  ngOnInit(): void {}
  handlePaymentModeToggle(event: any) {
    this.predefinedPaymentMode = event.value;
  }
  handleTaxModeToggle(event: any) {
    this.taxMode = event.value;
  }
  handleSlideToggle(event: any) {
    this._isChecked = event.checked;
    this.taxMode = 'default';
  }
}
