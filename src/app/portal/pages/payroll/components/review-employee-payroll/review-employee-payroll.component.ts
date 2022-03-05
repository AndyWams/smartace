import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
  selector: 'app-review-employee-payroll',
  templateUrl: './review-employee-payroll.component.html',
  styleUrls: ['./review-employee-payroll.component.scss'],
})
export class ReviewEmployeePayrollComponent implements OnInit, AfterViewInit {
  @ViewChild('selectRef') selectRef: ElementRef;
  @ViewChild('txtDate') txtDate: any;
  queryString: string;
  payElementDuration: string = 'oneOff';
  _selectedPayElements: string[] = [];
  _payElements: string[] = [
    'Test Element 1',
    'Test Element 2',
    'Test Element 3',
    'Test Element 4',
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
  hanglePayElementSelect(event: any) {
    if (event.target.value !== null) {
      this._selectedPayElements.push(event.target.value);
    }
  }
  dropItem(index: number) {
    this._selectedPayElements.splice(index, 1);
    this.selectRef.nativeElement.value = '';
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
  onDateChange() {}
}
