import {
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ObservableInput, throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { PayrollService } from 'src/app/portal/services/payroll.service';
import * as _helperFunc from 'src/app/portal/shared/_helperFunctions';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-quick-payroll',
  templateUrl: './quick-payroll.component.html',
  styleUrls: ['./quick-payroll.component.scss'],
})
export class QuickPayrollComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn_') closebtn_: any;
  @ViewChild('closebtn') closebtn: any;
  runByItem: string = 'Payscale';
  payChannel: number = 1;
  employeeList: any[] = [];
  grossList: any[] = [];
  unAssignedEmployees: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  emptyState: any;
  emptyState_: any;
  emptyState__: any = true;
  isBusy: boolean = false;
  isBusy_: boolean = false;
  noRecord: boolean = false;
  enumkey: any[] = [];
  paySchedules: any[] = [];
  payScales: any[] = [];
  payScaleId: any;
  isLoading: boolean = false;
  isLoading_: boolean = false;
  payScale: string = '';

  public createQuickPayrollForm: FormGroup = new FormGroup({});
  public filterForm: FormGroup = new FormGroup({});
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public dataSource_: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];
  public displayedColumns_: string[];
  constructor(
    private payrollServ: PayrollService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.createQuickPayrollForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: [null, Validators.required],
      paymentChannel: [1, Validators.required],
      employees: [null],
      payScheduleId: [null],
      runBy: [this.runByItem],
    });
  }

  ngOnInit(): void {
    this.getPaySchedules();
    this.getPayScale();
    this.getEnums();
    this.displayedColumns = [
      'name',
      'emp Id',
      'total earning',
      'total deduction',
      'net pay',
      'hours worked',
      'action',
    ];
    this.displayedColumns_ = [
      'name',
      'gross monthly salary',
      'earnings',
      'deductions',
      'net salary',
      'prorate deduction',
      'action',
    ];
  }
  get formRawValue(): any {
    return this.createQuickPayrollForm.getRawValue();
  }

  handleRunBy(event: any) {
    this.runByItem = event.source._value;
    this.selection.clear();
    this.getListLength(this.runByItem);
  }
  getListLength(runby: string) {
    if (runby == 'Payscale') {
      this.employeeList = [];
      this.grossList = [];
      this.emptyState = null;
      this.emptyState__ = true;
      this.isLoading = false;
    } else {
      this.emptyState__ = false;
      this.employeeList = [];
      this.emptyState = true;
      this.isLoading_ = true;
      this.getGrossnet();
    }
  }
  handlePayChannel(event: any) {
    this.payChannel = event.source._value;
  }
  handlePayScaleSelect(event: any) {
    this.payScaleId = event.source._value;
    this.grossList = [];
    this.getEmployees();
  }
  handlePayAssignee(event: any) {
    this.payScale = event.source._value;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows =
      this.runByItem == 'Payscale'
        ? this.dataSource.data.length
        : this.dataSource_.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.runByItem == 'Payscale'
      ? this.selection.select(...this.dataSource.data)
      : this.selection.select(...this.dataSource_.data);
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
      payScaleId: this.payScaleId,
    };
    this.isLoading = true;
    this.payrollServ
      .returnEmployeesNetByPayScaleId(model)
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
          this.isLoading = false;
          this.emptyState = null;
        },
        (errors) => {
          this.emptyState = errors;
        }
      );
  }
  getGrossnet() {
    let model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage,
      search: '',
      sortColumn: '',
      sortOrder: 1,
    };
    this.isLoading_ = true;
    this.payrollServ
      .returnEmployeeNetPay(model)
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe(
        (res) => {
          const { result } = res;
          const { data } = result;
          this.grossList = data;
          this.dataSource_ = new MatTableDataSource(this.grossList);
          this.dataSource_.paginator = this.paginator;
          this.isLoading_ = false;
          this.emptyState__ = null;
        },
        (errors) => {
          this.emptyState__ = errors;
        }
      );
  }
  runCheckForUnAssignedEmployees() {
    this.payrollServ
      .checkEmployeesNotInPayScale()
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe(
        (res) => {
          const { result } = res;
          this.unAssignedEmployees = result;
        },
        (err) => {
          if (err) {
            this.emptyState_ = err;
          }
        }
      );
  }
  getEnums() {
    this.payrollServ
      .fetchEnums()
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe((res) => {
        this.enumkey = res;
      });
  }
  getPaySchedules() {
    this.payrollServ
      .fetchPaySchedules()
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe((res) => {
        const { result } = res;
        this.paySchedules = result;
      });
  }
  getPayScale() {
    this.payrollServ
      .fetchPayScales()
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe((res) => {
        const { result } = res;
        this.payScales = result;
      });
  }
  onSubmit() {
    if (this.selection.selected.length !== 0) {
      let empIds = this.selection.selected
        .filter((x: any) => x !== undefined)
        .map((a: any) => {
          return {
            employeeId: a.employeeId,
          };
        });
      this.createQuickPayrollForm.patchValue({
        employees: empIds,
        paymentChannel: parseInt(
          this.createQuickPayrollForm.controls['paymentChannel'].value
        ),
      });
    }

    this.isBusy = true;
    if (this.createQuickPayrollForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.createQuickPayrollForm.valid) {
      //Make api call here...
      this.payrollServ.createQuickParoll(this.formRawValue).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.createQuickPayrollForm.reset();
          this.isBusy = false;
          this.closebtn_._elementRef.nativeElement.click();
          this.router.navigate(['/portal/payroll/payroll-run-log']);
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.createQuickPayrollForm.reset();
        }
      );
    }
  }
  onFilter() {
    this.isBusy_ = true;
    const model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage,
      search: '',
      sortColumn: '',
      sortOrder: 1,
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
            this.closebtn._elementRef.nativeElement.click();
            this.isBusy_ = false;
            this.filterForm.reset();
            this.emptyState = false;
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
}
