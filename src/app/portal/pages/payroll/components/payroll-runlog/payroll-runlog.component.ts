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
  pageSize: number = 10;
  currentPage: number = 1;
  emptyState: any;
  noRecord: boolean = false;
  isBusy: boolean = false;
  show_ref: boolean = false;
  payrollId: any;
  itemDetails: any;
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
  getPayrollLogs() {
    let model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage,
      search: '',
      sortColumn: '',
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
          const { result } = res;
          const { data, pagination } = result;
          this.payrollList = data;
          this.dataSource = new MatTableDataSource(this.payrollList);
          this.dataSource.paginator = this.paginator;
          this.show_ref = false;
          this.emptyState = null;
        },
        (errors) => {
          this.emptyState = errors;
          if (this.emptyState) {
            this.payrollList = [];
          }
        }
      );
  }
  getItemDetails(id: any) {
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
    if (this.itemDetails !== undefined) {
      this.payrollServ
        .deletePayroll(this.itemDetails.payrollId)
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
}
