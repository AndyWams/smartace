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
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { getStatusValue } from 'src/app/portal/shared/_helperFunctions';

@Component({
  selector: 'app-payroll-runlog',
  templateUrl: './payroll-runlog.component.html',
  styleUrls: ['./payroll-runlog.component.scss'],
})
export class PayrollRunlogComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('closebtn') closebtn: any;
  payrollList: any[] = [];
  pageSize: number = 20;
  currentPage: number = 0;
  noRecord: boolean = false;
  isBusy: boolean = false;
  show_ref: boolean = false;
  payrollId: any;
  itemDetails: any;
  _loading: boolean = false;
  statusValue = getStatusValue;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];
  constructor(
    private payrollServ: PayrollService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getPayrollLogs();
    this.displayedColumns = [
      'name',
      'ref no',
      'period',
      'date approved',
      'approved by',
      'status',
      'action',
    ];
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
  getPayrollLogs(sortOrder?: string) {
    this._loading = true;
    this.payrollList = [];
    let model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage + 1,
      search: '',
      sortColumn: sortOrder,
      sortOrder: 1,
      payScheduleId: null,
      startDate: null,
      endDate: null,
      payrollStatus: null,
    };

    this.payrollServ
      .fetchPayrollRunLog(model)
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
          this.payrollList = data;
          this.dataSource = new MatTableDataSource(this.payrollList);
          this.dataSource.paginator = this.paginator;
          this.paginator.pageIndex = this.currentPage;

          this.paginator.length = pagination.rowCount;
          this.show_ref = false;
        },
        (errors) => {
          if (errors) {
            this._loading = false;
            this.payrollList = [];
          }
        }
      );
  }
  getItemDetails(id: any) {
    this.payrollId = id;
    if (id !== undefined) {
      this.payrollServ
        .fetchPayrollLogDetails(id)
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
    if (this.payrollId !== undefined) {
      this.payrollServ
        .deletePayroll(this.payrollId)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe(({ message }) => {
          this.isBusy = false;
          this.toastr.success(message, 'Success');
          this.closebtn._elementRef.nativeElement.click();
          this.getPayrollLogs();
        });
    }
  }
  getFilterTerm(val: any) {
    this.payrollList = [];
    if (val && val !== null) {
      this.getPayrollLogs(val);
    } else {
      this.getPayrollLogs();
    }
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getPayrollLogs();
  }
}
