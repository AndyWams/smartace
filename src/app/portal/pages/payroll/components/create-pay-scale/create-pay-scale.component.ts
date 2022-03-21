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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IPayscale } from 'src/app/portal/models';

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
  @ViewChild('closebtn_') closebtn_: any;
  queryString: string = '';
  payElements: any[] = [];
  payElementItems: any[] = [];
  employeeList: any[] = [];
  departmentList: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  emptyState: any;
  isBusy: boolean = false;
  isBusy_: boolean = false;
  noRecord: boolean = false;
  show_ref: boolean = false;
  itemDetails: any;
  enumkey: any;
  _payscaleID: any;
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
      departmentId: [null, Validators.required],
      employementDate: [null],
    });
  }

  ngOnInit(): void {
    this.getRoutes();
    this.getDepartments();
    this.getItemDetails();
    this.getEmployees();
    this.getPayElements();
    this.getEnums();
    this.displayedColumns = this.column;
  }
  column = ['Name', 'employee Id', 'department', 'employment Date'];
  ngOnChanges() {}
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
  hanglePayElementSelect(event: any) {
    if (event.target.value !== null) {
      this.payElementItems.push(event.target.value);
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
    this.payElementItems = result;
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
      console.log(this.payElements.length);
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
          this.show_ref = false;
        },
        (errors) => {
          this.emptyState = errors;
        }
      );
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
          console.log(res);

          this.setFormControlElement();
        });
    }
  }
  setFormControlElement() {
    this.updatePayScaleForm = this.fb.group({
      payScaleName: [this.itemDetails.payScaleName, Validators.required],
      frequency: [this.itemDetails.frequency, Validators.required],
      payScaleElements: [],
      payScaleEmployees: [],
    });
  }
  onUpdate() {
    this.isBusy = true;
    if (this.updatePayScaleForm.valid) {
      this.payrollServ.updatePayscale(this.value_).subscribe(
        ({ message }) => {
          this.toastr.success(message, 'Message');
          this.updatePayScaleForm.reset();
          this.router.navigate(['/portal/payroll/pay-elements']);
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
}
