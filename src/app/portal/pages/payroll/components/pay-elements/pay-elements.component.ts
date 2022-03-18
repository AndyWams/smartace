import { Component, OnInit, ViewChild } from '@angular/core';
import { ObservableInput, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PayrollService } from 'src/app/portal/services/payroll.service';
import * as _helperFunc from 'src/app/portal/shared/_helperFunctions';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pay-elements',
  templateUrl: './pay-elements.component.html',
  styleUrls: ['./pay-elements.component.scss'],
})
export class PayElementsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  @ViewChild('closebtn_') closebtn_: any;
  payElementList: any[] = [];
  institutionList: any[] = [];
  payElementCats: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  emptyState: any;
  noRecord: boolean = false;
  show_ref: boolean = false;
  enumkey: any;
  enumKeys = [];
  isBusy: boolean = false;
  itemDetails: any;
  public filterForm: FormGroup = new FormGroup({});
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];

  constructor(
    private payrollServ: PayrollService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      payElementCatId: [null, Validators.required],
      payType: [null],
      elementType: [null],
      payElementName: [null],
      payElementAmount: [null],
      institutionId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getPayElements();
    this.getEnums();
    this.getPaymentInstitution();
    this.getPayElementsCats();
    this.displayedColumns = this.column;
    this.displayedColumns = this.displayedColumns.concat(['action']);
  }

  column = [
    'name',
    'pay Type',
    'element Name',
    'element Category',
    'element Type',
    'amount',
    'institution',
  ];
  ngOnChanges() {
    this.getPayElements();
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
  getPaymentInstitution() {
    this.payrollServ
      .fetchInstitution()
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe((res) => {
        const { result } = res;
        this.institutionList = result;
      });
  }
  getPayElementsCats() {
    this.payrollServ
      .fetchPayElementCategory()
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe((res) => {
        const { result } = res;
        this.payElementCats = result;
      });
  }
  getPayElements() {
    let model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage,
      search: '',
      sortColumn: '',
      sortOrder: 1,
      filter: {
        payElementCatId: null,
        payType: null,
        elementType: null,
        payElementName: null,
        payElementAmount: null,
        institutionId: null,
      },
    };
    this.payrollServ
      .fetchAllPayElements(model)
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe(
        (res) => {
          const { result } = res;
          const { data, pagination } = result;
          this.payElementList = data;
          this.dataSource = new MatTableDataSource(this.payElementList);
          this.dataSource.paginator = this.paginator;
          this.show_ref = false;
        },
        (errors) => {
          this.emptyState = errors;
          if (this.emptyState) {
            this.payElementList = [];
          }
        }
      );
  }
  getItemDetails(id: any) {
    if (id !== undefined) {
      this.payrollServ
        .fetchPayElementDetails(id)
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
  confirmDelete() {
    this.isBusy = true;
    if (this.itemDetails !== undefined) {
      this.payrollServ
        .deletePayElement(this.itemDetails.payElementId)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe(({ message }) => {
          this.isBusy = false;
          this.toastr.success(message, 'Success');
          this.closebtn._elementRef.nativeElement.click();
          this.getPayElements();
        });
    }
  }
  onFilter() {
    this.isBusy = true;
    const model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage,
      search: '',
      sortColumn: '',
      sortOrder: 1,
      filter: {
        payElementCatId: this.filterForm.controls['payElementCatId'].value,
        institutionId: this.filterForm.controls['institutionId'].value,
        payType: this.filterForm.controls['payType'].value,
        elementType: this.filterForm.controls['elementType'].value,
        payElementName: this.filterForm.controls['payElementName'].value,
        payElementAmount: this.filterForm.controls['payElementAmount'].value,
      },
    };
    if (this.filterForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.filterForm.valid) {
      this.payrollServ
        .fetchAllPayElements(model)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe(
          (res) => {
            const { result } = res;
            const { data, pagination } = result;
            this.payElementList = data;
            this.dataSource = new MatTableDataSource(this.payElementList);
            this.dataSource.paginator = this.paginator;
            this.closebtn_._elementRef.nativeElement.click();
            this.isBusy = false;
            this.noRecord = false;
            this.emptyState = false;
            this.show_ref = true;
            this.filterForm.reset();
          },
          (errors) => {
            this.emptyState = errors;
            this.noRecord = true;
            this.isBusy = false;
            if (this.emptyState) {
              this.payElementList = [];
            }
          },
          () => {
            this.isBusy = false;
            this.noRecord = false;
            this.filterForm.reset();
          }
        );
    }
  }
}
