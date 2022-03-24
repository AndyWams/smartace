import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ObservableInput, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PayrollService } from 'src/app/portal/services/payroll.service';
import { pensionData } from 'src/assets/raw_data';

@Component({
  selector: 'app-payroll-settings',
  templateUrl: './payroll-settings.component.html',
  styleUrls: ['./payroll-settings.component.scss'],
})
export class PayrollSettingsComponent implements OnInit {
  data = pensionData;
  screen: number = 1;
  isBusy: boolean = false;
  locationArray: any[] = [];
  countryList: any[] = [];
  stateList: any[] = [];
  details: any;

  public createTaxForm: FormGroup = new FormGroup({});
  public saveTaxForm: FormGroup = new FormGroup({});
  public saveNHFForm: FormGroup = new FormGroup({});
  public savePensionForm: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private payrollServ: PayrollService,
    private toastr: ToastrService
  ) {
    this.saveTaxForm = this.fb.group({
      isTaxEnable: [false],
      taxId: ['', Validators.required],
      countryId: [''],
      stateId: [''],
      location: this.fb.array([]),
    });
    this.saveNHFForm = this.fb.group({
      isNHFEnable: [false],
      nhfNumber: ['', Validators.required],
    });
    this.savePensionForm = this.fb.group({
      isPensionEnable: [false],
      pensionNumber: ['', Validators.required],
    });
    this.createTaxForm = this.fb.group({
      taxName: ['', Validators.required],
      taxPercentage: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getCountries();
    this.getStates();
    this.getDetails();
  }
  get taxFormValue(): any {
    return this.saveTaxForm.getRawValue();
  }
  get newTaxFormValue(): any {
    return this.createTaxForm.getRawValue();
  }
  get nhfFormValue(): any {
    return this.saveNHFForm.getRawValue();
  }
  get pensionFormValue(): any {
    return this.savePensionForm.getRawValue();
  }
  get locationValues(): FormArray {
    return <FormArray>this.saveTaxForm.get('location');
  }

  handleSlideToggle(event: any) {}
  gotoView(index: number) {
    this.screen = index;
  }

  newLocation(): FormGroup {
    return this.fb.group({
      name: [null, Validators.required],
    });
  }

  getCountries() {
    this.payrollServ.fetchCountries().subscribe((res) => {
      const { result } = res;
      this.countryList = result;
    });
  }
  getStates() {
    this.payrollServ.fetchStates().subscribe((res) => {
      const { result } = res;
      this.stateList = result;
    });
  }
  addLocation() {
    this.locationValues.push(this.newLocation());
  }
  removeLocation(index: number) {
    this.locationValues.removeAt(index);
  }
  onSaveTax() {
    this.isBusy = true;
    if (this.saveTaxForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.saveTaxForm.valid) {
      //Make api call here...
      this.payrollServ.saveTax(this.taxFormValue).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.saveTaxForm.reset();
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.saveTaxForm.reset();
        }
      );
    }
  }
  onSaveNHF() {
    this.isBusy = true;
    if (this.saveNHFForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.saveNHFForm.valid) {
      //Make api call here...
      this.payrollServ.saveNHF(this.nhfFormValue).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.saveNHFForm.reset();
          this.getDetails();
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.saveNHFForm.reset();
        }
      );
    }
  }
  getDetails() {
    this.payrollServ.fetchSettingsDetails().subscribe(
      (res) => {
        const { result } = res;
        this.details = result;
        this.setFormControlElement();
      },
      (error) => {}
    );
  }
  onSavePension() {
    this.isBusy = true;
    if (this.savePensionForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.savePensionForm.valid) {
      //Make api call here...
      this.payrollServ.savePension(this.pensionFormValue).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.savePensionForm.reset();
          this.getDetails();
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.savePensionForm.reset();
        }
      );
    }
  }
  onAddTax() {
    this.isBusy = true;
    if (this.createTaxForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.createTaxForm.valid) {
      //Make api call here...
      this.payrollServ.createTax(this.newTaxFormValue).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.createTaxForm.reset();
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.createTaxForm.reset();
        }
      );
    }
  }
  setFormControlElement() {
    this.saveTaxForm = this.fb.group({
      isTaxEnable: [this.details ? this.details.isTaxEnable : false],
      taxId: [this.details ? this.details.taxId : '', Validators.required],
      countryId: [this.details ? this.details.countryId : ''],
      stateId: [this.details ? this.details.stateId : ''],
      location: this.fb.array([]),
    });
    this.saveNHFForm = this.fb.group({
      isNHFEnable: [this.details ? this.details.isNHFEnable : false],
      nhfNumber: [
        this.details ? this.details.nhfNumber : '',
        Validators.required,
      ],
    });
    this.savePensionForm = this.fb.group({
      isPensionEnable: [this.details ? this.details.isPensionEnable : false],
      pensionNumber: [
        this.details ? this.details.pensionNumber : '',
        Validators.required,
      ],
    });
  }
}
