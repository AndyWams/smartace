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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IPayscale } from 'src/app/portal/models';
import { compareObjects } from 'src/app/portal/shared/_helperFunctions';

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
  @ViewChildren('options_') options_: any;
  @ViewChild('closebtn_') closebtn_: any;
  @ViewChild('closebtn') closebtn: any;
  queryString: string = '';
  payElements: any[] = [];
  payElements_: any[] = [];
  payElementItems: any[] = [];
  employeeList: any[] = [];
  departmentList: any[] = [];
  filteredPayElements: any[] = [];
  filteredEmployee: any[] = [];
  pageSize: number = 20;
  currentPage: number = 0;
  isBusy: boolean = false;
  isBusy_: boolean = false;
  noRecord: boolean = false;
  show_ref: boolean = false;
  itemDetails: any;
  enumkey: any[] = [];
  _payscaleID: any;
  _loading: boolean = false;
  totalRows = 0;
  compareFunc = compareObjects;
  public createPayScaleForm: FormGroup = new FormGroup({});
  public updatePayScaleForm: FormGroup = new FormGroup({});
  public filterForm: FormGroup = new FormGroup({});
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];

  constructor(
    private route: ActivatedRoute,
    private payrollServ: PayrollService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createPayScaleForm = this.fb.group({
      payScaleName: ['', Validators.required],
      frequency: [null, Validators.required],
      payScaleElements: [],
      payScaleEmployees: [],
    });
    this.filterForm = this.fb.group({
      employeeId: [null, Validators.required],
      departmentId: [null],
      employementDate: [null],
    });
  }
  ngOnInit(): void {
    this.getRoutes();
    this.getEmployees();
    this.getItemDetails();
    this.getDepartments();
    this.getPayElements();
    this.getEnums();
    this.displayedColumns = [
      'Name',
      'employee Id',
      'department',
      'employment Date',
    ];
  }

  ngOnChanges() {}
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  get formRawValue(): any {
    return this.createPayScaleForm.getRawValue();
  }
  get value_(): IPayscale {
    return this.updatePayScaleForm.getRawValue();
  }

  get stripedObjValue() {
    if (this.payElements.length !== 0) {
      return this.payElementItems.slice(0, 2).map((x: any) => x.payElementName);
    }
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
  checkInputDisabled() {
    if (this.payElements.length == 0) {
      this.createPayScaleForm.controls['payScaleElements'].disable();
    }
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
  getEmployees(sortOrder?: string) {
    this._loading = true;
    this.employeeList = [];
    let model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage + 1,
      search: '',
      sortColumn: sortOrder,
      sortOrder: 1,
    };
    this.payrollServ
      .fetchAllEmployees(model)
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
        this.payElements_ = this.payElements.map((x) => {
          return {
            payElementId: x.payElementId,
            payElementName: x.payElementName,
          };
        });
        this.checkInputDisabled();
      });
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
  onSubmit() {
    if (this.createPayScaleForm.controls['payScaleElements'].value !== null) {
      let ids = this.createPayScaleForm.controls['payScaleElements'].value
        .filter((x: any) => x !== 0)
        .map((a: any) => {
          return {
            payElementId: a.payElementId,
          };
        });
      this.createPayScaleForm.patchValue({
        payScaleElements: ids,
      });
    }
    if (this.selection.selected.length !== 0) {
      let empIds = this.selection.selected
        .filter((x: any) => x !== undefined)
        .map((a: any) => {
          return {
            employeeId: a.employeeId,
          };
        });
      this.createPayScaleForm.patchValue({
        payScaleEmployees: empIds,
      });
    }

    this.isBusy = true;
    if (this.createPayScaleForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.createPayScaleForm.valid) {
      //Make api call here...
      this.payrollServ.createPayscale(this.formRawValue).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.createPayScaleForm.reset();
          this.router.navigate(['/portal/payroll/pay-scale']);
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.createPayScaleForm.reset();
        }
      );
    }
  }
  getRoutes() {
    this.route.queryParams
      .pipe(filter((params) => params.query))
      .subscribe((params) => {
        this.queryString = params.query;
        this._payscaleID = params.id;
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/payroll/pay-scale']);
    }
  }
  getItemDetails() {
    this.selection.clear();
    if (this._payscaleID !== undefined) {
      this.payrollServ
        .fetchPayScaleDetails(this._payscaleID)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe(
          (res) => {
            const { result } = res;
            this.itemDetails = result;
            this.filteredPayElements = this.itemDetails['payScaleElements'].map(
              (x: any) => {
                return {
                  payElementId: x.payElement.payElementId,
                  payElementName: x.payElement.payElementName,
                };
              }
            );
            this.payElementItems = this.filteredPayElements;
            this.filteredEmployee = this.itemDetails['payScaleEmployees'].map(
              (x: any) => {
                return {
                  employeeId: x.employee.employeeId,
                };
              }
            );

            this.show_ref = false;
            this.setFormControlElement();
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
  setFormControlElement() {
    this.updatePayScaleForm = this.fb.group({
      payScaleName: [this.itemDetails.payScaleName, Validators.required],
      frequency: [this.itemDetails.frequency, Validators.required],
      payScaleElements: [this.filteredPayElements],
      payScaleEmployees: [this.filteredEmployee],
      payScaleId: [this.itemDetails['payScaleId']],
    });
  }
  onUpdate() {
    if (this.updatePayScaleForm.controls['payScaleElements'].value !== null) {
      let ids = this.updatePayScaleForm.controls['payScaleElements'].value
        .filter((x: any) => x !== 0)
        .map((a: any) => {
          return {
            payElementId: a.payElementId,
          };
        });
      this.updatePayScaleForm.patchValue({
        payScaleElements: ids,
      });
    }
    if (this.selection.selected.length !== 0) {
      let empIds = this.selection.selected
        .filter((x: any) => x !== undefined)
        .map((a: any) => {
          return {
            employeeId: a.employeeId,
          };
        });
      this.updatePayScaleForm.patchValue({
        payScaleEmployees: empIds,
      });
    }
    this.isBusy = true;
    if (this.updatePayScaleForm.valid) {
      this.payrollServ.updatePayscale(this.value_).subscribe(
        ({ message }) => {
          this.toastr.success(message, 'Message');
          this.updatePayScaleForm.reset();
          this.router.navigate(['/portal/payroll/pay-scale']);
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.updatePayScaleForm.reset();
        }
      );
    }
  }
  onFilter() {
    this.isBusy_ = true;
    this._loading = true;
    this.employeeList = [];
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
        .fetchAllEmployees(model)
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
            this._loading = false;
            this.noRecord = false;
            this.filterForm.reset();
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
            this.closebtn._elementRef.nativeElement.click();
            this.isBusy_ = false;
            this.filterForm.reset();

            this.show_ref = true;
          },
          () => {
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
    this.employeeList = [];
    if (val && val !== null) {
      this.getEmployees(val);
    } else {
      this.getEmployees();
    }
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getEmployees();
    this.onFilterPayScaleEmployees();
  }
}
