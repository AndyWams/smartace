import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ObservableInput, throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { PayrollService } from 'src/app/portal/services/payroll.service';
import * as _helperFunc from 'src/app/portal/shared/_helperFunctions';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-pay-scale',
  templateUrl: './create-pay-scale.component.html',
  styleUrls: ['./create-pay-scale.component.scss'],
})
export class CreatePayScaleComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
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

  employeeList: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  emptyState: any;
  isBusy: boolean = false;
  itemDetails: any;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];
  constructor(
    private route: ActivatedRoute,
    private payrollServ: PayrollService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getRoutes();
    this.getEmployees();
    this.displayedColumns = this.column;
  }
  column = ['Name', 'employee Id', 'department', 'employment Date'];
  ngOnChanges() {}
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

  toggleCheck(event: any, index: any) {}

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  concatColumnString(colString: string) {
    let strtext = colString;
    const myArray = strtext.split(' ');
    return myArray.join('');
  }

  getEmployees() {
    let model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage,
      search: '',
      sortColumn: '',
      sortOrder: 1,
    };
    this.payrollServ
      .fetchAllEmployees(model)
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe(
        (res) => {
          const { result } = res;
          const { data, pagination } = result;
          this.employeeList = data;
          this.dataSource = new MatTableDataSource(this.employeeList);
          this.dataSource.paginator = this.paginator;
        },
        (errors) => {
          this.emptyState = errors;
          console.log(errors);
        }
      );
  }
}
