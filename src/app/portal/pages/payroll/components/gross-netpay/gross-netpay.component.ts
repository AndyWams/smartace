import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ObservableInput, throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { PayrollService } from 'src/app/portal/services/payroll.service';
import * as _helperFunc from 'src/app/portal/shared/_helperFunctions';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import {
  getElementTypeValue,
  printElement,
} from 'src/app/portal/shared/_helperFunctions';
import { ExportServiceService } from 'src/app/portal/services/export-service.service';

@Component({
  selector: 'app-gross-netpay',
  templateUrl: './gross-netpay.component.html',
  styleUrls: ['./gross-netpay.component.scss'],
})
export class GrossNetpayComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  grossList: any[] = [];
  pageSize: number = 20;
  currentPage: number = 0;
  noRecord: boolean = false;
  isBusy: boolean = false;
  show_ref: boolean = false;
  payrollId: any;
  itemDetails: any;
  payElementBreakdown: any[] = [];
  _loading: boolean = false;
  file_name = 'gross_data';
  _printElement = printElement;
  elementTypeValue = getElementTypeValue;
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  constructor(
    private payrollServ: PayrollService,
    private exportService: ExportServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getGrossNet();
    this.displayedColumns = this.column;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  column = [
    'name',
    'gross ID',
    'department',
    'monthly earning',
    'monthly deduction',
    'net pay',
    'action',
  ];

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

  getGrossNet(sortOrder?: string) {
    this._loading = true;
    this.grossList = [];
    let model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage + 1,
      search: '',
      sortColumn: sortOrder,
      sortOrder: 1,
    };
    this.payrollServ
      .getGrossNet(model)
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe((res) => {
        this._loading = false;
        const { result } = res;
        this.grossList = result;
        this.dataSource = new MatTableDataSource(this.grossList);
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = this.grossList.length;
        this.show_ref = false;
      });
  }
  getItemDetails(obj: any) {
    if (obj !== undefined) {
      this.payrollServ
        .getGrossNetBreakdown(obj)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe((res) => {
          const { result } = res;
          this.itemDetails = result;
          this.payElementBreakdown = this.itemDetails.items;
        });
    }
  }
  getFilterTerm(val: any) {
    this.grossList = [];
    if (val && val !== null) {
      this.getGrossNet(val);
    } else {
      this.getGrossNet();
    }
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getGrossNet();
  }
  exportToExcel(): void {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        { A: 'Gross DATA' }, // title
        {
          A: 'Name',
          B: 'Gross ID',
          C: 'Department',
          D: 'Earnings',
          E: 'Deductions',
          F: 'Net pay',
        }, // table header
      ],
      skipHeader: true,
    };
    this.grossList.forEach((data) => {
      udt.data.push({
        A: data.employeeName,
        B: data.grossId,
        C: data.departmentName,
        D: data.totalEarning,
        E: data.totalDeduction,
        F: data.netPay,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, this.file_name);
  }
}
