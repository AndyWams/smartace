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
import { printElement } from 'src/app/portal/shared/_helperFunctions';
import { ExportServiceService } from 'src/app/portal/services/export-service.service';

@Component({
  selector: 'app-payslip-analysis',
  templateUrl: './payslip-analysis.component.html',
  styleUrls: ['./payslip-analysis.component.scss'],
})
export class PayslipAnalysisComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  payslipAnalysisList: any[] = [];
  pageSize: number = 20;
  currentPage: number = 0;
  noRecord: boolean = false;
  isBusy: boolean = false;
  show_ref: boolean = false;
  payrollId: any;
  payscheduleName: any;
  _loading: boolean = false;
  file_name = 'payslip_data';
  _printElement = printElement;
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
    this.getRoutes();
    this.displayedColumns = this.column;
  }
  column = ['name', 'emp ID', 'earnings', 'deductions', 'net pay', 'actions'];
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
  getRoutes() {
    this.route.queryParams
      .pipe(filter((params) => params.id))
      .subscribe((params) => {
        this.payrollId = params.id;
        this.getPayrollPayslipAnalysis();
      });
    if (this.payrollId === '') {
      this.router.navigate(['/portal/payroll/payroll-run-log']);
    }
  }
  getPayrollPayslipAnalysis(sortOrder?: string) {
    this._loading = true;
    this.payslipAnalysisList = [];
    let model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage + 1,
      search: '',
      sortColumn: sortOrder,
      sortOrder: 1,
      payrollId: this.payrollId,
    };
    this.payrollServ
      .payrollLogPayslipAnalysis(model)
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe((res) => {
        this._loading = false;
        const { result, pagination } = res;
        this.payslipAnalysisList = result.items;
        this.payscheduleName = result.payScheduleName;
        this.dataSource = new MatTableDataSource(this.payslipAnalysisList);
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = this.payslipAnalysisList.length;
        this.show_ref = false;
      });
  }
  getFilterTerm(val: any) {
    this.payslipAnalysisList = [];
    if (val && val !== null) {
      this.getPayrollPayslipAnalysis(val);
    } else {
      this.getPayrollPayslipAnalysis();
    }
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getPayrollPayslipAnalysis();
  }
  exportToExcel(): void {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        { A: 'PAYSLIP DATA' }, // title
        {
          A: 'Name',
          B: 'Employee ID',
          C: 'Earnings',
          D: 'Deductions',
          E: 'Net pay',
        }, // table header
      ],
      skipHeader: true,
    };
    this.payslipAnalysisList.forEach((data) => {
      udt.data.push({
        A: data.employeeName,
        B: data.employeeNo,
        C: data.totalEarning,
        D: data.totalDeduction,
        E: data.netPay,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, this.file_name);
  }
}
