import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ObservableInput, throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { PayrollService } from 'src/app/portal/services/payroll.service';
import { getFrequencyValue } from 'src/app/portal/shared';
import { employeeData } from 'src/assets/raw_data';

@Component({
  selector: 'app-view-payscale',
  templateUrl: './view-payscale.component.html',
  styleUrls: ['./view-payscale.component.scss'],
})
export class ViewPayscaleComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn_') closebtn_: any;
  @ViewChild('closebtn') closebtn: any;
  data = employeeData;
  pageSize: number = 10;
  currentPage: number = 1;
  emptyState: any;
  employeeList: any[] = [];
  departmentList: any[] = [];
  itemDetails: any;
  _payscaleID: any;
  isBusy_: boolean = false;
  show_ref: boolean = false;
  noRecord: boolean = false;
  public frequencyValue = getFrequencyValue;
  public filterForm: FormGroup = new FormGroup({});
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];
  constructor(
    private router: Router,
    private payrollServ: PayrollService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      employeeId: [null, Validators.required],
      departmentId: [null],
      employementDate: [null],
    });
  }
  column = ['Name', 'employee Id', 'department', 'employment Date'];
  ngOnInit(): void {
    this.getRoutes();
    this.getItemDetails();
    this.getDepartments();
    this.getPayScaleEmployees();
    this.displayedColumns = this.column;
  }
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
  getItemDetails() {
    if (this._payscaleID !== undefined) {
      this.payrollServ
        .fetchPayScaleDetails(this._payscaleID)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe((res) => {
          const { result } = res;
          this.itemDetails = result;
        });
    }
  }
  getPayScaleEmployees() {
    let model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage,
      search: '',
      sortColumn: '',
      sortOrder: 1,
      payScaleId: this._payscaleID,
      filter: {
        employeeId: null,
        departmentId: null,
        employementDate: null,
      },
    };
    this.payrollServ
      .fetchAllPayscaleEmployees(model)
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
          this.show_ref = false;
        },
        (errors) => {
          this.emptyState = errors;
        }
      );
  }
  getRoutes() {
    this.route.queryParams
      .pipe(filter((params) => params.id))
      .subscribe((params) => {
        this._payscaleID = params.id;
      });
  }
  getDepartments() {
    this.payrollServ
      .fetchDepartment()
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe((res) => {
        const { result } = res;
        this.departmentList = result;
      });
  }
  onFilter() {
    this.isBusy_ = true;
    const model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage,
      search: '',
      sortColumn: '',
      sortOrder: 1,
      payScaleId: this._payscaleID,
      filter: {
        employeeId: this.filterForm.controls['employeeId'].value,
        departmentId: this.filterForm.controls['departmentId'].value,
        employementDate: this.filterForm.controls['employementDate'].value,
      },
    };
    if (this.filterForm.invalid) {
      this.isBusy_ = false;
      return;
    }
    if (this.filterForm.valid) {
      this.payrollServ
        .fetchAllPayscaleEmployees(model)
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
            this.closebtn_._elementRef.nativeElement.click();
            this.isBusy_ = false;
            this.filterForm.reset();
            this.emptyState = false;
            this.show_ref = true;
          },
          (errors) => {
            this.emptyState = errors;
            this.isBusy_ = false;
            this.noRecord = true;
            if (this.emptyState) {
              this.employeeList = [];
            }
          },
          () => {
            this.isBusy_ = false;
            this.noRecord = false;
            this.filterForm.reset();
          }
        );
    }
  }
  confirmDelete() {
    this.isBusy_ = true;
    if (this.itemDetails !== undefined) {
      this.payrollServ
        .deletePayScale(this._payscaleID)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe(({ message }) => {
          this.isBusy_ = false;
          this.toastr.success(message, 'Success');
          this.closebtn._elementRef.nativeElement.click();
          this.router.navigate(['/portal/payroll/pay-scale']);
        });
    }
  }
}
