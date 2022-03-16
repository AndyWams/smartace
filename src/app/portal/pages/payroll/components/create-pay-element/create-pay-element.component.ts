import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ObservableInput, throwError } from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';
import { catchError } from 'rxjs/operators';
import { PayrollService } from 'src/app/portal/services/payroll.service';

@Component({
  selector: 'app-create-pay-element',
  templateUrl: './create-pay-element.component.html',
  styleUrls: ['./create-pay-element.component.scss'],
})
export class CreatePayElementComponent implements OnInit {
  @ViewChild('closebtn') closebtn: any;
  @ViewChild('allSelected') allSelected: any;
  @ViewChildren('options') _options: any;
  @ViewChild('matSelect') select: any;
  queryString: string = '';
  predefinedPaymentMode: number = 1;
  taxMode: string = 'default';
  payType: number = 1;
  _elementType: any;
  enumkey: any;
  enumKeys = [];
  taxTypes: any[] = [];
  payrollItem: string = 'default';
  _isChecked: boolean = false;
  payElments: any = [];
  isBusy: boolean = false;
  isBusy_ = false;
  institutionList: any[] = [];
  public createPayElmForm: FormGroup = new FormGroup({});
  public createPayrollItemForm: FormGroup = new FormGroup({});
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private payrollServ: PayrollService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.createPayElmForm = this.fb.group({
      parollItem: ['', Validators.required],
      payType: [1, Validators.required],
      payElementName: ['', Validators.required],
      payElementCatId: [null],
      elementType: [0, Validators.required],
      earningType: [''],
      amountPerHour: [''],
      noOfWorkHours: [''],
      paymentMode: [1],
      percentage: [''],
      payElementLine: [],
      payElementAmount: [''],
      deductTax: [false],
      taxId: [''],
      taxValue: [''],
      institutionId: ['', Validators.required],
    });

    this.createPayrollItemForm = this.fb.group({
      parollItemName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getRoutes();
    this.getPaymentInstitution();
    this.getEnums();
    this.getTaxTypes();
    this.checkInputDisabled();
  }
  ngAfterViewinit() {}
  options = [
    {
      payElementName: 'Pay Element 1',
      payElementId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    },
    {
      payElementName: 'Pay Element 2',
      payElementId: '3fa85f64-5717-4562-b3fc-2c963f66aga5',
    },
    {
      payElementName: 'Pay Element 3',
      payElementId: '3fa85f64-5717-4562-b3fc-2c963f66aha6',
    },
    {
      payElementName: 'Pay Element 4',
      payElementId: '3fa85f64-5717-4562-b3fc-2c963f66aia6',
    },
  ];

  getRoutes() {
    this.route.queryParams
      .pipe(filter((params) => params.query))
      .subscribe((params) => {
        this.queryString = params.query;
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/payroll/pay-elements']);
    }
  }
  get formRawValue(): any {
    return this.createPayElmForm.getRawValue();
  }
  get inputRawValue(): any {
    return this.createPayrollItemForm.getRawValue();
  }
  get stripedObjValue() {
    if (this.payElments.length !== 0) {
      return this.payElments.slice(0, 2).map((x: any) => x.payElementName);
    }
  }

  handlePaymentModeToggle(event: any) {
    this.predefinedPaymentMode = event.value;
    if (this.predefinedPaymentMode == 2) {
      this.createPayElmForm.controls['payElementAmount'].setValue('');
    } else {
      this.createPayElmForm.controls['percentage'].setValue('');
      this.createPayElmForm.controls['payElementLine'].setValue([]);
    }
  }
  handleTaxModeToggle(event: any) {
    this.taxMode = event.value;
    if (this.taxMode == 'default') {
      this.createPayElmForm.controls['taxValue'].setValue('');
    } else {
      this.createPayElmForm.controls['taxId'].setValue('');
    }
  }
  handleSlideToggle(event: any) {
    this._isChecked = event.checked;
    this.taxMode = 'default';
  }
  handlePayTypeSelect(event: any) {
    this.payType = event.source._value;
  }
  handlePayrollItemSelect(event: any) {
    this.payrollItem = event.source._value;
  }
  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.select.options._results.map((item) => {
        item.select();
      });
    } else {
      this.select.options._results.map((item) => {
        item.deselect();
      });
    }
  }
  handlePayElementChange(event: any) {
    let result = event.source._value.filter((t) => t !== 0);
    this.payElments = result;
  }

  toggleOne() {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.select.value.length == this.options.length) {
      this.allSelected.select();
    }
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
  getTaxTypes() {
    this.payrollServ
      .fetchTaxTypes()
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe((res) => {
        const { result } = res;
        this.taxTypes = result;
      });
  }
  checkInputDisabled() {
    if (this.options.length == 0) {
      this.createPayElmForm.controls['percentage'].disable();
      this.createPayElmForm.controls['payElementLine'].disable();
    }
  }

  onSubmit() {
    if (this.createPayElmForm.controls['payElementLine'].value !== null) {
      let ids = this.createPayElmForm.controls['payElementLine'].value
        .filter((x: any) => x !== 0)
        .map((a: any) => {
          return {
            payElementId: a.payElementId,
          };
        });
      this.createPayElmForm.patchValue({
        deductTax: true,
        payElementLine: ids,
      });
    }
    this.isBusy = true;
    if (this.createPayElmForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.createPayElmForm.valid) {
      //Make api call here...
      this.payrollServ.createPayElement(this.formRawValue).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.createPayElmForm.reset();
          this.router.navigate(['/portal/payroll/pay-elements']);
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.createPayElmForm.reset();
        }
      );
    }
  }
  onAddPayrollItem() {
    this.isBusy_ = true;
    if (this.createPayrollItemForm.valid) {
      this.payrollServ.createParollItem(this.inputRawValue).subscribe(
        ({ message }) => {
          this.toastr.success(message, 'Message');
          this.createPayrollItemForm.reset();
          this.closebtn._elementRef.nativeElement.click();
          // this.getParollItems();
        },
        (error) => {
          this.isBusy_ = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy_ = false;
          this.createPayrollItemForm.reset();
        }
      );
    }
  }
}
