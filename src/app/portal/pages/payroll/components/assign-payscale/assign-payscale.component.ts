import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ObservableInput, throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { PayrollService } from 'src/app/portal/services/payroll.service';
import { employeeData } from 'src/assets/raw_data';

@Component({
  selector: 'app-assign-payscale',
  templateUrl: './assign-payscale.component.html',
  styleUrls: ['./assign-payscale.component.scss'],
})
export class AssignPayscaleComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('allSelected') allSelected: any;
  @ViewChild('matSelect') select: any;
  @ViewChildren('options') _options: any;
  @ViewChild('closebtn') closebtn: any;
  @ViewChild('closebtn_') closebtn_: any;
  data = employeeData;
  queryString: string;
  payElements: string[] = [];
  payElementItems: any[] = [];
  unAssignedEmployees: any[] = [];
  departmentList: any[] = [];
  payScales: any[] = [];
  pageSize: number = 10;
  currentPage: number = 0;

  noRecord: boolean = false;
  show_ref: boolean = false;
  payScaleId: any;
  employeeId: any;
  isBusy: boolean = false;
  isBusy_: boolean = false;
  _loading: boolean = false;
  public assignEmpForm: FormGroup = new FormGroup({});
  public filterForm: FormGroup = new FormGroup({});
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private payrollServ: PayrollService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.assignEmpForm = this.fb.group({
      payScaleId: ['', Validators.required],
      payScaleEmployees: [],
    });
    this.filterForm = this.fb.group({
      employeeId: [null, Validators.required],
      departmentId: [null],
      employementDate: [null],
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getRoutes();
    this.getPayElements();
    this.getDepartments();
    this.runCheckForUnAssignedEmployees();
    this.getPayScale();
    this.displayedColumns = [
      'Name',
      'emp id',
      'department',
      'employment date',
      'action',
    ];
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  get formRawValue(): any {
    return this.assignEmpForm.getRawValue();
  }
  getPayElements() {
    this.payrollServ
      .fetchPayElement()
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe((res) => {
        const { result } = res;
        this.payElements = result;
      });
  }
  dropItem(index: number) {
    let x = index;
    this.allSelected.deselect();
    this.select.selected[x].deselect();
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
    this.payElementItems = result.map((x) => x);
  }
  handlePayScaleSelect(event: any) {
    this.payScaleId = event.source._value;
  }
  toggleOne() {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.select.value.length == this.payElements.length) {
      this.allSelected.select();
    }
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
  runCheckForUnAssignedEmployees(sortOrder?: string) {
    this._loading = true;
    this.unAssignedEmployees = [];
    let model = {
      pageNumber: this.currentPage + 1,
      pageSize: this.pageSize,
      search: '',
      sortColumn: sortOrder,
      sortOrder: 1,
      filter: {
        employeeId: '',
        departmentId: '',
        employementDate: '',
      },
    };
    this.payrollServ
      .runCheckEmployeesNotInPayScale(model)
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe((res) => {
        this._loading = false;
        const { result, pagination } = res;
        this.unAssignedEmployees = result;
        this.dataSource = new MatTableDataSource(this.unAssignedEmployees);
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = this.unAssignedEmployees.length;
        this.show_ref = false;
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
      this.assignEmpForm.patchValue({
        payScaleEmployees: empIds,
      });
    }

    this.isBusy = true;
    if (this.assignEmpForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.assignEmpForm.valid) {
      //Make api call here...
      this.payrollServ.assignEmployeesToPayScale(this.formRawValue).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.assignEmpForm.reset();
          this.runCheckForUnAssignedEmployees();
          this.closebtn._elementRef.nativeElement.click();
          this.isBusy = false;
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.assignEmpForm.reset();
        }
      );
    }
  }
  onFilter() {
    this._loading = true;
    this.isBusy_ = true;
    const model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage + 1,
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
        .runCheckEmployeesNotInPayScale(model)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe(
          (res) => {
            this._loading = false;
            const { result, pagination } = res;
            this.unAssignedEmployees = result;
            this.dataSource = new MatTableDataSource(this.unAssignedEmployees);
            this.paginator.pageIndex = this.currentPage;
            // this.paginator.length = pagination.rowCount;
            this.closebtn_._elementRef.nativeElement.click();
            this.isBusy_ = false;
            this.filterForm.reset();

            this.show_ref = true;
          },
          (errors) => {
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
  getFilterTerm(val: any) {
    this.unAssignedEmployees = [];
    if (val && val !== null) {
      this.runCheckForUnAssignedEmployees(val);
    } else {
      this.runCheckForUnAssignedEmployees();
    }
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.runCheckForUnAssignedEmployees();
  }
}
