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
import {
  getFrequencyValue,
  printElement,
} from 'src/app/portal/shared/_helperFunctions';
import { ExportServiceService } from 'src/app/portal/services/export-service.service';

@Component({
  selector: 'app-pay-scale',
  templateUrl: './pay-scale.component.html',
  styleUrls: ['./pay-scale.component.scss'],
})
export class PayScaleComponent implements OnInit {
  @ViewChild('closebtn') closebtn: any;
  @ViewChild('closebtn_') closebtn_: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  payscaleList: any[] = [];
  payElementList: any[] = [];
  pageSize: number = 20;
  currentPage = 0;
  noRecord: boolean = false;
  isBusy: boolean = false;
  show_ref: boolean = false;
  itemDetails: any;
  _loading: boolean = false;
  totalRows = 0;
  hidePagenator: boolean = false;
  file_name = 'payscale_data';
  frequencyValue = getFrequencyValue;
  _printElement = printElement;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];
  public filterForm: FormGroup = new FormGroup({});

  constructor(
    private payrollServ: PayrollService,
    private exportService: ExportServiceService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      payScaleName: ['', Validators.required],
      payScaleElements: [null],
      frequency: [''],
    });
  }

  ngOnInit(): void {
    this.getPayscale();
    this.getPayElements();
    this.displayedColumns = [
      'Name',
      'pay Elements',
      'pay Frequency',
      'no of Employees',
      'action',
    ];
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnChanges() {}
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
  getItemDetails(id: any) {
    if (id !== undefined) {
      this.payrollServ
        .fetchPayScaleDetails(id)
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
        this.payElementList = result;
      });
  }
  getPayscale(sortOrder?: string) {
    this._loading = true;
    this.payscaleList = [];
    let model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage + 1,
      search: '',
      sortColumn: sortOrder,
      sortOrder: 1,
      filter: {
        payScaleName: null,
        frequency: null,
      },
    };
    this.payrollServ
      .fetchAllPayscale(model)
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
          this.payscaleList = data;
          this.dataSource = new MatTableDataSource(this.payscaleList);
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = pagination.rowCount;
          this.show_ref = false;
        },
        (errors) => {
          if (errors) {
            this._loading = false;
            this.payscaleList = [];
          }
        }
      );
  }
  confirmDelete() {
    this.isBusy = true;
    if (this.itemDetails !== undefined) {
      this.payrollServ
        .deletePayScale(this.itemDetails.payScaleId)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe(({ message }) => {
          this.isBusy = false;
          this.toastr.success(message, 'Success');
          this.closebtn_._elementRef.nativeElement.click();
          this.getPayscale();
        });
    }
  }
  onFilter() {
    this.isBusy = true;
    this._loading = true;
    this.payscaleList = [];
    const model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage + 1,
      search: '',
      sortColumn: '',
      sortOrder: 1,
      filter: {
        payScaleName: this.filterForm.controls['payScaleName'].value,
        frequency: this.filterForm.controls['frequency'].value,
      },
    };
    if (this.filterForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.filterForm.valid) {
      this.payrollServ
        .fetchAllPayscale(model)
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
            this.payscaleList = data;
            this.dataSource = new MatTableDataSource(this.payscaleList);
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = pagination.rowCount;
            this.closebtn._elementRef.nativeElement.click();
            this.isBusy = false;
            this.noRecord = false;
            this.show_ref = true;
            this.filterForm.reset();
          },
          () => {
            this._loading = false;
            this.isBusy = false;
            this.noRecord = true;
          },
          () => {
            this.isBusy = false;
            this._loading = false;
            this.noRecord = false;
            this.filterForm.reset();
          }
        );
    }
  }
  getFilterTerm(val: any) {
    this.payscaleList = [];
    if (val && val !== null) {
      this.getPayscale(val);
    } else {
      this.getPayscale();
    }
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getPayElements();
  }
  exportToExcel(): void {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        { A: 'PAYSCALE DATA' }, // title
        {
          A: '#',
          B: 'Name',
          C: 'Pay elements',
          D: 'Pay frequency',
          E: 'Number of employees',
        }, // table header
      ],
      skipHeader: true,
    };
    this.payscaleList.forEach((data) => {
      let res = data.payScaleElements.map((x) => x.payElement.payElementName);
      udt.data.push({
        A: data.payScaleId,
        B: data.payScaleName,
        C: res.toString(),
        D: data.frequency,
        E: data.totalEmployees,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, this.file_name);
  }
}
