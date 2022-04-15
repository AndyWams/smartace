import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ObservableInput, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PayrollService } from 'src/app/portal/services/payroll.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  data: any;
  reportMode: string = 'Period';
  reportType: string = '';
  screen: number = 1;
  pageSize: number = 10;
  currentPage: number = 1;
  emptyState: any;
  noRecord: boolean = false;
  show_ref: boolean = false;
  bankScheduleList: any[] = [];
  isBusy: boolean = false;
  _reports: string[] = [
    'Bank Schedule Report',
    'Earning Report',
    'Deduction Report',
    'All Element Sheet Report',
    'Deduction Summary Report',
    'Payment Summary Report',
    'Tax Details Report',
    'Pension Details Report',
    'Payslip Analysis Report',
  ];
  public reportForm: FormGroup = new FormGroup({});
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  constructor(
    private payrollServ: PayrollService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.reportForm = this.fb.group({
      reportType: [''],
      period: [null, Validators.required],
    });
  }

  ngOnInit(): void {}

  get formRawValue(): any {
    return this.reportForm.getRawValue();
  }
  handleReportSelect(event: any) {
    this.reportType = event.source._value;
  }
  handleReportMode(event: any) {
    this.reportMode = event.value;
  }
  gotoView(type: string) {
    if (type == 'next') {
      this.screen = this.screen + 1;
    }
    if (type == 'prev') {
      this.screen = this.screen - 1;
    }
  }
  fetchBankScheduleListReport() {
    let model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage,
      search: '',
      sortColumn: '',
      sortOrder: 1,
      period: this.reportForm.controls['period'].value,
    };
    this.isBusy = true;
    if (this.reportForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.reportForm.valid) {
      this.payrollServ
        .generateBankScheduleListReport(model)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe(
          (res) => {
            const { result } = res;
            this.isBusy = false;
            this.reportForm.reset();
            this.bankScheduleList = result;
            this.dataSource = new MatTableDataSource(this.bankScheduleList);
            this.dataSource.paginator = this.paginator;
            this.show_ref = false;
            this.data = this.bankScheduleList;
            this.gotoView('next');
          },
          (errors) => {
            this.emptyState = errors;
            if (this.emptyState) {
              this.bankScheduleList = [];
            }
          }
        );
    }
  }

  getDataSource(repType: string) {
    switch (repType) {
      case (repType = 'Bank Schedule Report'):
        this.fetchBankScheduleListReport();
        return this.data;
      case (repType = 'Earning Report'):
        return null;
      case (repType = 'Deduction Report'):
        return null;
      case (repType = 'All Element Sheet Report'):
        return null;
      case (repType = 'Deduction Summary Report'):
        return null;
      case (repType = 'Payment Summary Report'):
        return null;
      case (repType = 'Tax Details Report'):
        return null;
      case (repType = 'Pension Details Report'):
        return null;
      case (repType = 'Payslip Analysis Report'):
        return null;
    }
    return this.data;
  }
  onGenerate() {
    this.getDataSource(this.reportType);
  }
}
