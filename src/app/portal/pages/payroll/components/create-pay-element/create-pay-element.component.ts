import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
  selector: 'app-create-pay-element',
  templateUrl: './create-pay-element.component.html',
  styleUrls: ['./create-pay-element.component.scss'],
})
export class CreatePayElementComponent implements OnInit {
  @ViewChild('allSelected') allSelected: any;
  @ViewChildren('options') _options: any;
  @ViewChild('matSelect') select: any;
  queryString: string = '';
  predefinedPaymentMode: string = 'predefined';
  taxMode: string = 'default';
  payType: string = 'Monthly';
  payrollItem: string = 'default';
  _isChecked: boolean = false;
  payElments: any = [];
  masterSelected: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.getRoutes();
  }
  ngAfterViewinit() {}
  options = [
    { value: 'Pay Element 1', label: 'Pay Element 1' },
    { value: 'Pay Element 2', label: 'Pay Element 2' },
    { value: 'Pay Element 3', label: 'Pay Element 3' },
  ];
  selectedPayElements = ['Pay Element 1', 'Pay Element 2'];
  getRoutes() {
    this.route.queryParams
      .pipe(filter((params) => params.query))
      .subscribe((params) => {
        this.queryString = params.query;
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/payroll/pay-elements']);
    }
  }

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
  handlePayTypeSelect(event: any) {
    this.payType = event.target.value;
  }
  handlePayrollItemSelect(event: any) {
    this.payrollItem = event.target.value;
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
    this.payElments = result;
    // if (this.payElments.length === this.options.length) {
    //   this.allSelected.select();
    // }
  }

  toggleOne() {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
  }
  handleOptionChanage(event: any) {}
}
