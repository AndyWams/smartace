import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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
  public saveTaxForm: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private payrollServ: PayrollService,
    private toastr: ToastrService
  ) {
    this.saveTaxForm = this.fb.group({
      isTaxEnable: [false],
      taxId: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      nhfNumber: [''],
      location: this.fb.array([]),
    });
  }

  ngOnInit(): void {}
  get taxFormValue(): any {
    return this.saveTaxForm.getRawValue();
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
      this.payrollServ.savePayrollSettings(this.taxFormValue).subscribe(
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
}
