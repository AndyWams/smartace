import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { employeeData } from 'src/assets/raw_data';

@Component({
  selector: 'app-create-pay-scale',
  templateUrl: './create-pay-scale.component.html',
  styleUrls: ['./create-pay-scale.component.scss'],
})
export class CreatePayScaleComponent implements OnInit {
  @ViewChild('selectRef') selectRef: ElementRef;
  queryString: string = '';
  _payElements: string[] = [
    'Test Element 1',
    'Test Element 2',
    'Test Element 3',
    'Test Element 4',
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
    this._selectedPayElements.splice(index, 1);
    this.selectRef.nativeElement.value = '';
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
