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
import { IPayElement } from 'src/app/portal/models';
import { PayrollService } from 'src/app/portal/services/payroll.service';
import { commaFormatted, numberCheck } from 'src/app/portal/shared';

@Component({
  selector: 'app-create-pay-element',
  templateUrl: './create-pay-element.component.html',
  styleUrls: ['./create-pay-element.component.scss'],
})
export class CreatePayElementComponent implements OnInit {
  @ViewChild('closebtn') closebtn: any;
  @ViewChild('closebtn_') closebtn_: any;
  @ViewChild('closebtn__') closebtn__: any;
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
  payrollItemList: any[] = [];
  payElementCats: any[] = [];
  payrollItem: string = 'default';
  _isChecked: boolean = false;
  isBusy: boolean = false;
  isBusy_: boolean = false;
  institutionList: any[] = [];
  _payElementID: any;
  itemDetails: any;
  payElements: any[] = [];
  payElementItems: any[] = [];
  commaFormat = commaFormatted;
  numberCheck = numberCheck;
  public createPayElmForm: FormGroup = new FormGroup({});
  public createPayrollItemForm: FormGroup = new FormGroup({});
  public createElementCatForm: FormGroup = new FormGroup({});
  public updatePayElementForm: FormGroup = new FormGroup({});
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private payrollServ: PayrollService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.createPayElmForm = this.fb.group({
      payrollItemId: [''],
      payType: [1, Validators.required],
      payElementName: ['', Validators.required],
      payElementCategoryId: [''],
      elementType: [0, Validators.required],
      earningType: [0],
      amountPerHour: [0],
      noOfWorkHours: [0],
      paymentMode: [1],
      payElementPercentage: [0],
      payElementLine: [],
      payElementAmount: [0],
      deductTax: [false],
      taxId: [null],
      taxValue: [null],
      institutionId: ['', Validators.required],
    });

    this.createPayrollItemForm = this.fb.group({
      payrollItemName: ['', Validators.required],
    });
    this.createElementCatForm = this.fb.group({
      payElementCategoryName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getRoutes();
    this.getPayElements();
    this.getItemDetails();
    this.getPaymentInstitution();
    this.getEnums();
    this.getPayElementsCats();
    this.getTaxTypes();
    this.getPayrollItems();
  }
  ngOnChanges() {}
  ngAfterViewinit() {}

  get formRawValue(): any {
    return this.createPayElmForm.getRawValue();
  }
  get value_(): IPayElement {
    return this.updatePayElementForm.getRawValue();
  }
  get inputRawValue(): any {
    return this.createPayrollItemForm.getRawValue();
  }
  get catRawValue(): any {
    return this.createElementCatForm.getRawValue();
  }
  get stripedObjValue() {
    if (this.payElements.length !== 0) {
      return this.payElementItems.slice(0, 2).map((x: any) => x.payElementName);
    }
  }

  handlePaymentModeToggle(event: any) {
    this.predefinedPaymentMode = event.value;
    if (this.predefinedPaymentMode == 1) {
      this.createPayElmForm.controls['payElementLine'].setValue([]);
    }
  }
  handleTaxModeToggle(event: any) {
    this.taxMode = event.value;
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
    let result = event.source._value.filter((t) => t);
    this.payElementItems = result;
  }
  toggleOne() {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.select.value.length == this.payElements.length) {
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
  getPayElementsCats() {
    this.payrollServ
      .fetchPayElementCategory()
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe((res) => {
        const { result } = res;
        this.payElementCats = result;
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
      .subscribe(
        (res) => {
          const { result } = res;
          this.payElements = result;
        },
        (error) => {
          if (error) {
            this.checkInputDisabled();
          }
        }
      );
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
  getPayrollItems() {
    this.payrollServ
      .fetchPayrollItems()
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe((res) => {
        const { result } = res;
        this.payrollItemList = result;
      });
  }

  checkInputDisabled() {
    this.createPayElmForm.controls['payElementPercentage'].disable();
    this.createPayElmForm.controls['payElementLine'].disable();
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
          this.getPayrollItems();
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
  onAddPayElementCat() {
    this.isBusy_ = true;
    if (this.createElementCatForm.valid) {
      this.payrollServ.createPayElementCategory(this.catRawValue).subscribe(
        ({ message }) => {
          this.toastr.success(message, 'Message');
          this.createElementCatForm.reset();
          this.closebtn_._elementRef.nativeElement.click();
          this.getPayElementsCats();
        },
        (error) => {
          this.isBusy_ = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy_ = false;
          this.createElementCatForm.reset();
        }
      );
    }
  }
  getRoutes() {
    this.route.queryParams
      .pipe(filter((params) => params.query))
      .subscribe((params) => {
        this.queryString = params.query;
        this._payElementID = params.id;
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/payroll/pay-elements']);
    }
  }
  getItemDetails() {
    if (this._payElementID !== undefined) {
      this.payrollServ
        .fetchPayElementDetails(this._payElementID)
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
    if (this.itemDetails.deductTax) {
      this._isChecked = true;
    } else {
      this._isChecked = false;
    }
    this.updatePayElementForm = this.fb.group({
      parollItem: [''],
      payType: [this.itemDetails.payType, Validators.required],
      payElementName: [this.itemDetails.payElementName, Validators.required],
      payElementCategoryId: [this.itemDetails.payElementCategoryId],
      elementType: [this.itemDetails.elementType, Validators.required],
      earningType: [''],
      amountPerHour: [''],
      noOfWorkHours: [''],
      paymentMode: [this.itemDetails.paymentMode],
      payElementPercentage: [this.itemDetails.payElementPercentage],
      payElementLine: [],
      payElementAmount: [this.itemDetails.payElementAmount],
      deductTax: [this.itemDetails.deductTax],
      taxId: [this.itemDetails.taxId],
      taxValue: [this.itemDetails.taxValue],
      institutionId: [this.itemDetails.institutionId, Validators.required],
      payElementId: [this.itemDetails.payElementId],
    });
  }
  onUpdate() {
    this.isBusy = true;
    if (this.updatePayElementForm.valid) {
      this.payrollServ.updatePayElement(this.value_).subscribe(
        ({ message }) => {
          this.toastr.success(message, 'Message');
          this.updatePayElementForm.reset();
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
          this.updatePayElementForm.reset();
        }
      );
    }
  }
  confirmDelete() {
    this.isBusy_ = true;
    if (this.itemDetails !== undefined) {
      this.payrollServ
        .deletePayElement(this._payElementID)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe(({ message }) => {
          this.isBusy_ = false;
          this.toastr.success(message, 'Success');
          this.router.navigate(['/portal/payroll/pay-elements']);
          this.closebtn__._elementRef.nativeElement.click();
        });
    }
  }
}
