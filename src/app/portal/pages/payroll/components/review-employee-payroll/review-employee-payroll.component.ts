import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
  selector: 'app-review-employee-payroll',
  templateUrl: './review-employee-payroll.component.html',
  styleUrls: ['./review-employee-payroll.component.scss'],
})
export class ReviewEmployeePayrollComponent implements OnInit, AfterViewInit {
  @ViewChild('txtDate') txtDate: any;
  @ViewChild('txtDate_') txtDate_: any;
  @ViewChild('allSelected') allSelected: any;
  @ViewChildren('options') _options: any;
  @ViewChild('matSelect') select: any;
  queryString: string;
  payElementDuration: string = 'oneOff';
  _selectedPayElements: string[] = [];
  options = [
    { value: 'Pay Element 1', label: 'Pay Element 1' },
    { value: 'Pay Element 2', label: 'Pay Element 2' },
    { value: 'Pay Element 3', label: 'Pay Element 3' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getRoutes();
  }
  ngAfterViewInit() {
    this.onDateLoad();
  }

  dropItem(index: number) {
    let x = index;
    this.allSelected.deselect();
    this._options._results[x].deselect();
    this._options._results.splice(x, 1);
  }
  handleToggle(event: any) {
    this.payElementDuration = event.value;
  }
  onDateLoad() {
    var dtToday = new Date();
    var month: any = dtToday.getMonth() + 1;
    var day: any = dtToday.getDate();
    var year = dtToday.getFullYear();
    if (month < 10) month = '0' + month.toString();
    if (day < 10) day = '0' + day.toString();
    var maxDate = year + '-' + month + '-' + day;

    this.renderer.setAttribute(this.txtDate.nativeElement, 'min', maxDate);
    this.renderer.setProperty(this.txtDate.nativeElement, 'value', maxDate);
    this.renderer.setAttribute(this.txtDate_.nativeElement, 'min', maxDate);
    this.renderer.setProperty(this.txtDate_.nativeElement, 'value', maxDate);
  }
  getRoutes() {
    this.route.queryParams
      .pipe(filter((params) => params.query))
      .subscribe((params) => {
        this.queryString = params.query;
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/payroll/quick-payroll']);
    }
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

  toggleOne() {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
  }
  onDateChange() {}
}
