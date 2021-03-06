import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
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
import { scehduleOption } from 'src/assets/raw_data';
import {
  formatDate,
  getFrequencyValue,
} from 'src/app/portal/shared/_helperFunctions';
import { ExportServiceService } from 'src/app/portal/services/export-service.service';

@Component({
  selector: 'app-payschedule-setup',
  templateUrl: './payschedule-setup.component.html',
  styleUrls: ['./payschedule-setup.component.scss'],
})
export class PayscheduleSetupComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('matSelect') select: any;
  @ViewChildren('radioItem') radioItem: any;
  @ViewChild('closebtn') closebtn: any;
  @ViewChild('closebtn_') closebtn_: any;
  @ViewChild('close') close: any;
  screen: number = 1;
  selectedItem: any;
  pageSize: number = 20;
  currentPage: number = 0;
  payScheduleList: any[] = [];
  itemDetails: any;
  enumkey: any;
  enumKeys = [];
  _payscheduleID: any;
  isBusy: boolean = false;
  show_ref: boolean = false;
  _loading: boolean = false;
  file_name = 'payschedule_data';
  date = new Date().toISOString();
  formatdate = formatDate;
  public createPaySheduleForm: FormGroup = new FormGroup({});
  public assignEmployeesForm: FormGroup = new FormGroup({});
  public updatePayScheduleForm: FormGroup = new FormGroup({});
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];
  _scheduleOption = scehduleOption;
  frequencyValue = getFrequencyValue;
  constructor(
    private renderer: Renderer2,
    private payrollServ: PayrollService,
    private exportService: ExportServiceService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createPaySheduleForm = this.fb.group({
      payScheduleName: [null, Validators.required],
      frequency: [null],
      payrollInitializationDate: [null, Validators.required],
      payrollDeadlineDate: [null, Validators.required],
      payrollPaymentDate: [null, Validators.required],
    });
    this.assignEmployeesForm = this.fb.group({
      payScaleId: [null, Validators.required],
      employeeId: [null],
    });
  }

  ngOnInit(): void {
    this.getPaySchedules();
    this.getEnums();
    this.displayedColumns = [
      'Name',
      'pay frequency',
      'payroll payment date',
      'action',
    ];
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  get formRawValue(): any {
    return this.createPaySheduleForm.getRawValue();
  }
  get value_() {
    return this.updatePayScheduleForm.getRawValue();
  }

  gotoView(screenType?: string, screenIndex?: number) {
    if (screenType === 'next') {
      this.screen = this.screen + 1;
    }
    if (screenType === 'prev') {
      this.screen = this.screen - 1;
    }
    if (screenIndex) {
      this.screen = screenIndex;
    }
  }
  handdleScheduleToggle(event: any, i: number) {
    this.radioItem._results.map((x: any, index: number) => {
      if (i === index) {
        this.renderer.addClass(x.nativeElement, 'active');
      } else {
        this.renderer.removeClass(x.nativeElement, 'active');
      }
    });
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
  getPaySchedules(sortOrder?: string) {
    this._loading = true;
    this.payScheduleList = [];
    let model = {
      pageNumber: this.currentPage + 1,
      pageSize: this.pageSize,
      search: null,
      sortColumn: sortOrder,
      sortOrder: 1,
    };
    this.payrollServ
      .fetchAllPaySchedule(model)
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
          this.payScheduleList = data;
          this.dataSource = new MatTableDataSource(this.payScheduleList);
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = pagination.rowCount;
          this.show_ref = false;
          this.screen = 2;
        },
        (errors) => {
          if (errors) {
            this._loading = false;
            this.payScheduleList = [];
          }
        }
      );
  }
  onSubmit() {
    this.isBusy = true;
    if (this.createPaySheduleForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.createPaySheduleForm.valid) {
      //Make api call here...
      this.payrollServ.createPaySchedule(this.formRawValue).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.createPaySheduleForm.reset();
          this.closebtn._elementRef.nativeElement.click();
          this.getPaySchedules();
          this.screen = 2;
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.createPaySheduleForm.reset();
        }
      );
    }
  }
  getItemDetails(id: any) {
    if (id !== undefined) {
      this.payrollServ
        .fetchPayScheduleDetails(id)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe((res) => {
          const { result } = res;
          this.itemDetails = result;
          this.setFormControlElement();
        });
    }
  }
  setFormControlElement() {
    this.updatePayScheduleForm = this.fb.group({
      payScheduleName: [
        this.itemDetails['payScheduleName'],
        Validators.required,
      ],
      frequency: [this.itemDetails['frequency']],
      payrollInitializationDate: [
        this.formatdate(this.itemDetails['payrollInitializationDate']),
        Validators.required,
      ],
      payrollDeadlineDate: [
        this.formatdate(this.itemDetails['payrollDeadlineDate']),
        Validators.required,
      ],
      payrollPaymentDate: [
        this.formatdate(this.itemDetails['payrollPaymentDate']),
        Validators.required,
      ],
      payScheduleId: [this.itemDetails['payScheduleId']],
    });
  }
  onUpdate() {
    this.isBusy = true;
    if (this.updatePayScheduleForm.valid) {
      this.payrollServ.updatePaySchedule(this.value_).subscribe(
        ({ message }) => {
          this.toastr.success(message, 'Message');
          this.updatePayScheduleForm.reset();
          this.closebtn_._elementRef.nativeElement.click();
          this.getPaySchedules();
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.updatePayScheduleForm.reset();
        }
      );
    }
  }
  onAssign() {}
  confirmDelete() {
    this.isBusy = true;
    if (this.itemDetails !== undefined) {
      this.payrollServ
        .deletePaySchedule(this.itemDetails.payScheduleId)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe(({ message }) => {
          this.isBusy = false;
          this.toastr.success(message, 'Success');
          this.close._elementRef.nativeElement.click();
          this.getPaySchedules();
        });
    }
  }
  getFilterTerm(val: any) {
    this.payScheduleList = [];
    if (val && val !== null) {
      this.getPaySchedules(val);
    } else {
      this.getPaySchedules();
    }
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getPaySchedules();
  }
  exportToExcel(): void {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        { A: 'Payschedule DATA' }, // title
        {
          A: 'Name',
          B: 'Frequency',
          C: 'Payroll Pay Date',
        }, // table header
      ],
      skipHeader: true,
    };
    this.payScheduleList.forEach((data) => {
      udt.data.push({
        A: data.payScheduleName,
        B: data.frequency,
        C: data.payrollPaymentDate,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, this.file_name);
  }
}
