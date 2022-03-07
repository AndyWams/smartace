import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { employeeData } from 'src/assets/raw_data';

@Component({
  selector: 'app-create-pay-scale',
  templateUrl: './create-pay-scale.component.html',
  styleUrls: ['./create-pay-scale.component.scss'],
})
export class CreatePayScaleComponent implements OnInit {
  @ViewChild('matSelect') select: any;
  @ViewChild('allSelected') allSelected: any;
  @ViewChildren('options') _options: any;
  queryString: string = '';
  options = [
    { value: 'Pay Element 1', label: 'Pay Element 1' },
    { value: 'Pay Element 2', label: 'Pay Element 2' },
    { value: 'Pay Element 3', label: 'Pay Element 3' },
  ];
  _payFrequencies: string[] = [
    'Daily',
    'Weekly',
    'Monthly',
    'Bi-annual',
    'Annually',
  ];
  _selectedPayElements: string[] = [];
  data = employeeData;
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.getRoutes();
  }
  hanglePayElementSelect(event: any) {
    if (event.target.value !== null) {
      this._selectedPayElements.push(event.target.value);
    }
  }
  dropItem(index: number) {
    let x = index;
    this.allSelected.deselect();
    this._options._results[x].deselect();
    this._options._results.splice(x, 1);
  }
  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.select.options._results.map((item) => {
        item.select();
      });
    } else {
      this.select.options._results.map((item) => {
        item.deselect();
      });
    }
  }
  handlePayElementChange(event: any) {
    let result = event.source._value.filter((t) => t !== 0);
    this._selectedPayElements = result;
  }
  handlePayFrequencyChange(event: any) {}

  toggleOne() {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
  }
  getRoutes() {
    this.route.queryParams
      .pipe(filter((params) => params.query))
      .subscribe((params) => {
        this.queryString = params.query;
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/payroll/pay-scale']);
    }
  }
}
