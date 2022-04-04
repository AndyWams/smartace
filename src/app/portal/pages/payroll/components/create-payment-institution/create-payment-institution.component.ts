import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ObservableInput, throwError } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { IInstitution, IInstitutionCat } from 'src/app/portal/models';
import { PayrollService } from 'src/app/portal/services/payroll.service';
@Component({
  selector: 'app-create-payment-institution',
  templateUrl: './create-payment-institution.component.html',
  styleUrls: ['./create-payment-institution.component.scss'],
})
export class CreatePaymentInstitutionComponent implements OnInit {
  @ViewChild('closebtn') closebtn: any;
  queryString: string = '';
  recordId: any;
  itemDetails: any;
  categoryType: string;
  bankList: any[] = [];
  institutionCat: any[] = [];
  isBusy: boolean = false;
  isBusy_: boolean = false;
  public createInstitutionForm: FormGroup = new FormGroup({});
  public updateInstitutionForm: FormGroup = new FormGroup({});
  public createInstitutionCatForm: FormGroup = new FormGroup({});
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private payrollServ: PayrollService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.createInstitutionForm = this.fb.group({
      institutionCategoryId: ['', Validators.required],
      institutionName: ['', Validators.required],
      accountName: ['', Validators.required],
      accountNumber: ['', [Validators.required, Validators.minLength(10)]],
      bankId: ['', Validators.required],
    });

    this.createInstitutionCatForm = this.fb.group({
      institutionCategoryName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getRoutes();
    this.getAllBanks();
    this.getInstitutionCat();
    this.getItemDetails();
  }
  handleCategorySelect(event: any) {
    this.categoryType = event.value;
  }
  get value(): IInstitution {
    return this.createInstitutionForm.getRawValue();
  }
  get value_(): IInstitution {
    return this.updateInstitutionForm.getRawValue();
  }
  get inputValue(): IInstitutionCat {
    return this.createInstitutionCatForm.getRawValue();
  }

  getAllBanks() {
    this.payrollServ
      .fetchAllBanks()
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe((res) => {
        const { result } = res;
        this.bankList = result;
      });
  }
  getInstitutionCat() {
    this.payrollServ
      .fetchInstitutionCategory()
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe((res) => {
        const { result } = res;
        this.institutionCat = result;
      });
  }
  onSubmit(evn) {
    this.isBusy = true;
    if (this.createInstitutionForm.valid) {
      this.payrollServ.createInstitution(this.value).subscribe(
        ({ message }) => {
          this.toastr.success(message, 'Message');
          this.createInstitutionForm.reset();
          if (evn.srcElement.innerText == 'Save and Continue') {
            this.router.navigate(['/portal/payroll/institute-management']);
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
          this.createInstitutionForm.reset();
        }
      );
    }
  }
  onCreateNew() {
    this.isBusy_ = true;
    if (this.createInstitutionCatForm.valid) {
      this.payrollServ.createInstitutionCat(this.inputValue).subscribe(
        ({ message }) => {
          this.toastr.success(message, 'Message');
          this.createInstitutionCatForm.reset();
          this.closebtn._elementRef.nativeElement.click();
          this.getInstitutionCat();
        },
        (error) => {
          this.isBusy_ = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy_ = false;
          this.createInstitutionCatForm.reset();
        }
      );
    }
  }
  onUpdate() {
    this.isBusy = true;
    if (this.updateInstitutionForm.valid) {
      this.payrollServ.updateInstitution(this.value_).subscribe(
        ({ message }) => {
          this.toastr.success(message, 'Message');
          this.updateInstitutionForm.reset();
          this.router.navigate(['/portal/payroll/institute-management']);
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.updateInstitutionForm.reset();
        }
      );
    }
  }

  getRoutes() {
    this.route.queryParams
      .pipe(filter((params) => params.query))
      .subscribe((params) => {
        this.queryString = params.query;
        this.recordId = params.id;
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/payroll/institute-management']);
    }
  }
  getItemDetails() {
    if (this.recordId !== undefined) {
      this.payrollServ
        .fetchInstitutionDetails(this.recordId)
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
    this.updateInstitutionForm = this.fb.group({
      institutionCategoryId: [
        this.itemDetails.institutionCategoryId,
        Validators.required,
      ],
      institutionName: [this.itemDetails.institutionName, Validators.required],
      institutionId: [this.itemDetails.institutionId],
      accountName: [this.itemDetails.accountName, Validators.required],
      accountNumber: [
        this.itemDetails.accountNumber,
        [Validators.required, Validators.minLength(10)],
      ],
      bankId: [this.itemDetails.bankId, Validators.required],
    });
  }
}
