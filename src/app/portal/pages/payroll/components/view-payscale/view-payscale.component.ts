import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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
  pageSize: number = 20;
  currentPage: number = 0;
  employeeList: any[] = [];
  departmentList: any[] = [];
  itemDetails: any;
  _payscaleID: any;
  isBusy_: boolean = false;
  show_ref: boolean = false;
  noRecord: boolean = false;
  _loading: boolean = false;
  public frequencyValue = getFrequencyValue;
  public filterForm: FormGroup = new FormGroup({});
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
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

    this.displayedColumns = this.column;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
  getPayScaleEmployees(sortOrder?: string) {
    this._loading = true;
    this.employeeList = [];
    let model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage + 1,
      search: '',
      sortColumn: sortOrder,
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
      .subscribe((res) => {
        this._loading = false;
        const { result } = res;
        const { data, pagination } = result;
        this.employeeList = data;
        this.dataSource = new MatTableDataSource(this.employeeList);
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = pagination.rowCount;
        this.show_ref = false;
      });
  }
  getRoutes() {
    this.route.queryParams
      .pipe(filter((params) => params.id))
      .subscribe((params) => {
        this._payscaleID = params.id;
        this.getPayScaleEmployees();
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
    this._loading = true;
    this.employeeList = [];
    this.isBusy_ = true;
    const model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage + 1,
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
            this._loading = false;
            const { result } = res;
            const { data, pagination } = result;
            this.employeeList = data;
            this.dataSource = new MatTableDataSource(this.employeeList);
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = pagination.rowCount;
            this.closebtn_._elementRef.nativeElement.click();
            this.isBusy_ = false;
            this.filterForm.reset();

            this.show_ref = true;
          },
          () => {
            this._loading = false;
            this.isBusy_ = false;
            this.noRecord = true;
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
  getFilterTerm(val: any) {
    this.employeeList = [];
    if (val && val !== null) {
      this.getPayScaleEmployees(val);
    } else {
      this.getPayScaleEmployees();
    }
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getPayScaleEmployees();
  }
}
