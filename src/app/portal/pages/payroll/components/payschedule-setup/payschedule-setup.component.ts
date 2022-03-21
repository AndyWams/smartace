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
import { payscheduleData, scehduleOption } from 'src/assets/raw_data';

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
  screen: number = 1;
  selectedItem: any;
  pageSize: number = 10;
  currentPage: number = 1;
  emptyState: any;
  payScheduleList: any[] = [];
  itemDetails: any;
  enumkey: any;
  enumKeys = [];
  _payscheduleID: any;
  isBusy: boolean = false;
  public createPaySheduleForm: FormGroup = new FormGroup({});
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];
  constructor(
    private renderer: Renderer2,
    private payrollServ: PayrollService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createPaySheduleForm = this.fb.group({
      payScheduleName: [null, Validators.required],
      frequency: [null, Validators.required],
      date: [null, Validators.required],
      deadline: [null, Validators.required],
      payPeriod: [null, Validators.required],
    });
  }

  data = payscheduleData;
  _scheduleOption = scehduleOption;
  column = ['Name', 'pay Frequency', 'pay Date'];
  ngOnInit(): void {
    this.getEnums();
    this.displayedColumns = this.column;
    this.displayedColumns = this.displayedColumns.concat(['action']);
  }

  get formRawValue(): any {
    return this.createPaySheduleForm.getRawValue();
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
}
