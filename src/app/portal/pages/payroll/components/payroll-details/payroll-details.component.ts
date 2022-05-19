import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ObservableInput, throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { PayrollService } from 'src/app/portal/services/payroll.service';
import {
  commaFormatted,
  compareObjects,
  getElementTypeValue,
  getPaymentChannelValue,
  getStatusValue,
  numberCheck,
} from 'src/app/portal/shared/_helperFunctions';

@Component({
  selector: 'app-payroll-details',
  templateUrl: './payroll-details.component.html',
  styleUrls: ['./payroll-details.component.scss'],
})
export class PayrollDetailsComponent implements OnInit {
  @ViewChild('closebtn') closebtn: any;
  @ViewChild('closebtn_') closebtn_: any;
  @ViewChild('txtDate') txtDate: any;
  @ViewChild('_txtDate') _txtDate: any;
  @ViewChild('txtDate_') txtDate_: any;
  @ViewChild('allSelected') allSelected: any;
  @ViewChild('allSelected_') allSelected_: any;
  @ViewChildren('options') options: any;
  @ViewChild('matSelect') select: any;
  @ViewChild('matSelect_') select_: any;
  queryString: string;
  payElementDuration: string = 'oneOff';
  payElementDuration_: string = 'oneOff_';
  payElements: string[] = [];
  payElementItems: any[] = [];
  payElementItems_: any[] = [];
  payElementBreakdownList: any[] = [];
  enumkey: any[] = [];
  itemDetails: any;
  payrollId: string;
  isBusy: boolean = false;
  isBusy_: boolean = false;
  employeeId: any;
  payelementDetails: any;

  filteredPayElements: any[] = [];
  compareFunc = compareObjects;
  numberCheck = numberCheck;
  commaFormat = commaFormatted;
  query_: string = 'edit';
  payChannel = getPaymentChannelValue;
  statusValue = getStatusValue;
  elementTypeValue = getElementTypeValue;

  public addPayelementForm: FormGroup = new FormGroup({});
  public updatePayElementForm: FormGroup = new FormGroup({});
  constructor(
    private payrollServ: PayrollService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private fb: FormBuilder
  ) {
    this.addPayelementForm = this.fb.group({
      employeeId: [null],
      payElementLine: [null, Validators.required],
      startDate: [null],
      endDate: [null],
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getRoutes();
    this.getPayElements();
    this.getEnums();
  }
  ngAfterViewInit() {
    if (this.query_ !== 'edit') {
      this.onDateLoad();
    }
  }
  get formRawValue(): any {
    return this.addPayelementForm.getRawValue();
  }
  get editFormValue(): any {
    return this.updatePayElementForm.getRawValue();
  }
  get stripedObjValue() {
    if (this.payElements.length !== 0) {
      return this.payElementItems.slice(0, 2).map((x: any) => x.payElementName);
    }
  }
  get stripedObjValue_() {
    if (this.payElements.length !== 0) {
      return this.payElementItems_
        .slice(0, 2)
        .map((x: any) => x.payElementName);
    }
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
      });
  }
  dropItem(index: number, allSlc: any, slc: any) {
    let x = index;
    allSlc.deselect();
    slc.selected[x].deselect();
    if (allSlc) {
      this.options._results.splice(x, 1);
    }
  }
  toggleAllSelection(allSlc: any, slc: any) {
    if (allSlc.selected) {
      slc.options._results.map((item) => {
        item.select();
      });
    } else {
      slc.options._results.map((item) => {
        item.deselect();
      });
    }
  }
  toggleOne(allSlc: any, slc: any) {
    if (allSlc.selected) {
      allSlc.deselect();
      return false;
    }
    if (slc == this.select && slc.value.length == this.payElements.length) {
      allSlc.select();
    }
    if (slc == this.select_ && slc.value.length == this.payElements.length) {
      allSlc.select();
    }
  }
  handlePayElementChange(event: any) {
    let result = event.source._value.filter((t) => t !== 0);
    this.payElementItems = result.map((x) => x);
  }
  handlePayElementChange_(event: any) {
    let result = event.source._value.filter((t) => t !== 0);
    this.payElementItems_ = result.map((x) => x);
  }
  handleToggle(event: any) {
    this.payElementDuration = event.value;
    if (this.payElementDuration == 'oneOff') {
      this.addPayelementForm.controls['startDate'].setValue(null);
      this.addPayelementForm.controls['endDate'].setValue(null);
      this.renderer.setProperty(this.txtDate.nativeElement, 'value', null);
      this.renderer.setProperty(this._txtDate.nativeElement, 'value', null);
    } else {
      this.onDateLoad();
    }
  }
  handleToggle_(event: any) {
    this.payElementDuration_ = event.value;
    if (this.payElementDuration_ == 'oneOff_') {
      this.updatePayElementForm.controls['startDate'].setValue(null);
      this.updatePayElementForm.controls['endDate'].setValue(null);
      this.renderer.setProperty(this.txtDate.nativeElement, 'value', null);
      this.renderer.setProperty(this._txtDate.nativeElement, 'value', null);
    } else {
      this.onDateLoad();
    }
  }
  onDateLoad() {
    var dtToday = new Date();
    var month: any = dtToday.getMonth() + 1;
    var day: any = dtToday.getDate();
    var year = dtToday.getFullYear();
    if (month < 10) month = '0' + month.toString();
    if (day < 10) day = '0' + day.toString();
    var maxDate = year + '-' + month + '-' + day;

    this.renderer.setAttribute(this.txtDate.nativeElement, 'min', maxDate);
    this.renderer.setProperty(this.txtDate.nativeElement, 'value', maxDate);
    this.addPayelementForm.controls['startDate'].setValue(maxDate);
    if (this.payelementDetails) {
      this.updatePayElementForm.controls['startDate'].setValue(maxDate);
    }
  }
  onApprove() {
    this.isBusy = true;
    if (this.payrollId !== undefined) {
      this.payrollServ
        .approvePayroll(this.payrollId)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe(
          (res) => {
            const { result } = res;
            this.isBusy = false;
            if (result) {
              this.router.navigate(['/portal/payroll/payroll-run-log']);
            }
          },
          (error) => {
            this.isBusy = false;
            this.toastr.error(error, 'Message', {
              timeOut: 3000,
            });
          },
          () => {
            this.isBusy = false;
          }
        );
    }
  }
  onDecline() {
    this.isBusy_ = true;
    if (this.payrollId !== undefined) {
      this.payrollServ
        .declinePayrollApproval(this.payrollId)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe(
          (res) => {
            const { result } = res;
            this.isBusy_ = false;
            if (result) {
              this.router.navigate(['/portal/payroll/payroll-run-log']);
            }
          },
          (error) => {
            this.isBusy_ = false;
            this.toastr.error(error, 'Message', {
              timeOut: 3000,
            });
          },
          () => {
            this.isBusy_ = false;
          }
        );
    }
  }
  getRoutes() {
    this.route.queryParams
      .pipe(filter((params) => params.query))
      .subscribe((params) => {
        this.queryString = params.query;
        this.payrollId = params.id;
        this.getItemDetails();
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/payroll/payroll-run-log']);
    }
  }
  getItemDetails() {
    if (this.payrollId !== undefined) {
      this.payrollServ
        .fetchPayrollLogDetails(this.payrollId)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe((res) => {
          const { result } = res;
          this.itemDetails = result;
          this.payElementBreakdownList = this.itemDetails.payElements;
        });
    }
  }
  onAddPayElement() {
    let ids: any;
    if (this.addPayelementForm.controls['payElementLine'].value !== null) {
      ids = this.addPayelementForm.controls['payElementLine'].value
        .filter((x: any) => x !== 0)
        .map((a: any) => {
          return {
            payElementId: a.payElementId,
          };
        });
    }
    this.addPayelementForm.patchValue({
      payElementLine: ids,
      employeeId: this.employeeId,
    });

    this.isBusy = true;
    if (this.addPayelementForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.addPayelementForm.valid) {
      //Make api call here...
      this.payrollServ.addPayElementExtra(this.formRawValue).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.addPayelementForm.reset();
          this.closebtn._elementRef.nativeElement.click();
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.addPayelementForm.reset();
        }
      );
    }
  }
  onUpdate() {
    let ids: any;
    if (this.updatePayElementForm.controls['payElementLine'].value !== null) {
      ids = this.updatePayElementForm.controls['payElementLine'].value
        .filter((x: any) => x !== 0)
        .map((a: any) => {
          return {
            payElementId: a.payElementId,
          };
        });
    }
    this.updatePayElementForm.patchValue({
      payElementLine: ids,
      payElementAmount: parseFloat(
        `${this.updatePayElementForm.controls['payElementAmount'].value}`.replace(
          /,/g,
          ''
        )
      ),
      employeeId: this.employeeId,
    });

    this.isBusy = true;
    if (this.updatePayElementForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.updatePayElementForm.valid) {
      //Make api call here...
      this.payrollServ.updatePayelementExtra(this.editFormValue).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.updatePayElementForm.reset();
          this.closebtn_._elementRef.nativeElement.click();
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.updatePayElementForm.reset();
        }
      );
    }
  }
  setFormControlElement() {
    this.updatePayElementForm = this.fb.group({
      employeeId: [null],
      startDate: [this.payelementDetails.startDate],
      endDate: [this.payelementDetails.endDate],
      payElementLine: [this.filteredPayElements],
      payElementAmount: [this.payelementDetails.payElementAmount],
      payrollExtraId: [this.payelementDetails.payrollItemId],
    });
  }
  getPayelementDetails(itemId) {
    this.payelementDetails = null;
    if (itemId !== undefined) {
      this.payrollServ
        .fetchPayElementDetails(itemId)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe(
          (res) => {
            const { result } = res;
            this.payelementDetails = result;
            this.filteredPayElements = this.payelementDetails[
              'payElementLine'
            ].map((x: any) => {
              return {
                payElementId: x.payElementId,
                payElementName: x.payElement.payElementName,
              };
            });
            this.payElementItems_ = this.filteredPayElements;
            this.setFormControlElement();
          },
          () => {
            this.payelementDetails = null;
          }
        );
    } else {
      this.toastr.error('Something went wrong!', 'Message', {
        timeOut: 3000,
      });
    }
  }
}
