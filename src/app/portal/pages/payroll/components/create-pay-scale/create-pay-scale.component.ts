import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { employeeData } from 'src/assets/raw_data';

@Component({
  selector: 'app-create-pay-scale',
  templateUrl: './create-pay-scale.component.html',
  styleUrls: ['./create-pay-scale.component.scss'],
})
export class CreatePayScaleComponent implements OnInit {
  @ViewChild('selectRef') selectRef: ElementRef;
  _payElements: string[] = ['Item1', 'Item2', 'Item3', 'Item4'];
  _payFrequencies: string[] = [
    'Daily',
    'Weekly',
    'Monthly',
    'Bi-annual',
    'Annually',
  ];
  _selectedPayElements: string[] = [];
  data = employeeData;
  constructor() {}

  ngOnInit(): void {}
  hanglePayElementSelect(event: any) {
    if (event.target.value !== null) {
      this._selectedPayElements.push(event.target.value);
    }
  }
  dropItem(index: number) {
    this._selectedPayElements.splice(index, 1);
    this.selectRef.nativeElement.value = '';
  }
}
