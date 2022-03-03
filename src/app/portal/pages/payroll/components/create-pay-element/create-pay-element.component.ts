import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
  selector: 'app-create-pay-element',
  templateUrl: './create-pay-element.component.html',
  styleUrls: ['./create-pay-element.component.scss'],
})
export class CreatePayElementComponent implements OnInit {
  queryString: string = '';
  predefinedPaymentMode: string = 'predefined';
  taxMode: string = 'default';
  payType: string = 'Monthly';
  _isChecked: boolean = false;
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
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
    console.log(event.target.value);
    this.payType = event.target.value;
  }
}
