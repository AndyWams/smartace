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
  @ViewChild('closeBtn') closeBtn: any;
  runByItem: string = 'Payscale';
  payChannel: number = 1;
  employeeList: any[] = [];
  grossList: any[] = [];
  unAssignedEmployees: any[] = [];
  pageSize: number = 20;
  currentPage: number = 0;
  emptyState_: boolean = false;
  isBusy: boolean = false;
  isBusy_: boolean = false;
  noRecord: boolean = false;
  enumkey: any[] = [];
  paySchedules: any[] = [];
  payScales: any[] = [];
  payScaleId: any;
  payScale: string = '';
  bankBalance: any;
  _loading: boolean = false;
  totalRows = 0;
  show_ref: boolean = false;
  public createQuickPayrollForm: FormGroup = new FormGroup({});
  public filterPayscaleEmployeesForm: FormGroup = new FormGroup({});
  public filterGrossNetForm: FormGroup = new FormGroup({});
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
    this.filterPayscaleEmployeesForm = this.fb.group({
      employeeId: [null, Validators.required],
      totalEarnings: [null],
      totalDeductions: [null],
      netPay: [null],
      hoursWorked: [null],
    });
    this.filterGrossNetForm = this.fb.group({
      grossMonthlySalary: [null, Validators.required],
      totalEarnings: [null],
      totalDeductions: [null],
      netPay: [null],
      prorateDeduction: [null],
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
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
    } else {
      this.employeeList = [];
      this.getGrossnet();
    }
  }
  handlePayChannel(event: any) {
    this.payChannel = event.source._value;
    if (this.payChannel == 2) {
      this.getTenantBankBalance();
    }
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
  getEmployees(sortOrder?: string) {
    this._loading = true;
    this.employeeList = [];
    let model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage + 1,
      search: '',
      sortColumn: sortOrder,
      sortOrder: 1,
      payScaleId: this.payScaleId,
      filter: {
        employeeId: null,
        totalEarnings: null,
        totalDeductions: null,
        netPay: null,
        hoursWorked: null,
      },
    };
    this.payrollServ
      .returnEmployeesNetByPayScaleId(model)
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
  getGrossnet(sortOrder?: string) {
    this._loading = true;
    this.grossList = [];
    let model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage + 1,
      search: '',
      sortColumn: sortOrder,
      sortOrder: 1,
      filter: {
        grossMonthlySalary: null,
        totalEarnings: null,
        totalDeductions: null,
        netPay: null,
        prorateDeduction: null,
      },
    };
    this.payrollServ
      .returnEmployeeNetPay(model)
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe((res) => {
        this._loading = false;
        const { result } = res;
        const { data, pagination } = result;
        this.grossList = data;
        this.dataSource_ = new MatTableDataSource(this.grossList);
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = pagination.rowCount;
        this.show_ref = false;
      });
  }
  getTenantBankBalance() {
    this.payrollServ
      .getTenanceBankBalance()
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe((res) => {
        this.bankBalance = res.result;
      });
  }
  runCheckForUnAssignedEmployees() {
    if (this.selection.selected.length == 0) {
      this.createQuickPayrollForm.controls['employees'].setErrors({
        invalid: true,
      });
      this.toastr.info('Select an item before continuing', 'Message');
    } else {
      this.createQuickPayrollForm.controls['employees'].setErrors(null);
    }
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
        () => {
          this.emptyState_ = true;
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
  onFilterPayScaleEmployees() {
    this.isBusy_ = true;
    this._loading = true;
    this.employeeList = [];
    const model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage + 1,
      search: '',
      sortColumn: '',
      sortOrder: 1,
      payScaleId: this.payScaleId,
      filter: {
        employeeId:
          this.filterPayscaleEmployeesForm.controls['employeeId'].value,
        totalEarnings:
          this.filterPayscaleEmployeesForm.controls['totalEarnings'].value,
        totalDeductions:
          this.filterPayscaleEmployeesForm.controls['totalDeductions'].value,
        netPay: this.filterPayscaleEmployeesForm.controls['netPay'].value,
        hoursWorked:
          this.filterPayscaleEmployeesForm.controls['hoursWorked'].value,
      },
    };
    if (this.filterPayscaleEmployeesForm.invalid) {
      this.isBusy_ = false;
      return;
    }
    if (this.filterPayscaleEmployeesForm.valid) {
      this.payrollServ
        .returnEmployeesNetByPayScaleId(model)
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
            this.closebtn._elementRef.nativeElement.click();
            this.isBusy_ = false;
            this.filterPayscaleEmployeesForm.reset();
            this.show_ref = true;
          },
          () => {
            this.isBusy_ = false;
            this.noRecord = true;
          },
          () => {
            this.isBusy_ = false;
            this.noRecord = false;
            this.filterPayscaleEmployeesForm.reset();
          }
        );
    }
  }
  onFilterGrossNets() {
    this.isBusy_ = true;
    this._loading = true;
    this.grossList = [];
    const model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage + 1,
      search: '',
      sortColumn: '',
      sortOrder: 1,
      payScaleId: this.payScaleId,
      filter: {
        grossMonthlySalary:
          this.filterGrossNetForm.controls['grossMonthlySalary'].value,
        totalEarnings: this.filterGrossNetForm.controls['totalEarnings'].value,
        totalDeductions:
          this.filterGrossNetForm.controls['totalDeductions'].value,
        netPay: this.filterGrossNetForm.controls['netPay'].value,
        prorateDeduction:
          this.filterGrossNetForm.controls['prorateDeduction'].value,
      },
    };
    if (this.filterGrossNetForm.invalid) {
      this.isBusy_ = false;
      return;
    }
    if (this.filterGrossNetForm.valid) {
      this.payrollServ
        .returnEmployeeNetPay(model)
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
            this.grossList = data;
            this.dataSource = new MatTableDataSource(this.grossList);
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = pagination.rowCount;
            this.closeBtn._elementRef.nativeElement.click();
            this.isBusy_ = false;
            this.filterGrossNetForm.reset();
            this.show_ref = true;
          },
          () => {
            this.isBusy_ = false;
            this.noRecord = true;
          },
          () => {
            this.isBusy_ = false;
            this.noRecord = false;
            this.filterGrossNetForm.reset();
          }
        );
    }
  }
  getFilterTerm(val: any) {
    this.employeeList = [];
    if (val && val !== null) {
      this.getEmployees(val);
      this.getGrossnet(val);
    } else {
      this.getEmployees();
      this.getGrossnet();
    }
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getEmployees();
    this.getGrossnet();
  }
}
