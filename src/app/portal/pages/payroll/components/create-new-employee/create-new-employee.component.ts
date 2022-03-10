import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PayrollService } from 'src/app/portal/services/payroll.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-create-new-employee',
  templateUrl: './create-new-employee.component.html',
  styleUrls: ['./create-new-employee.component.scss'],
})
export class CreateNewEmployeeComponent implements OnInit {
  public form: FormGroup = new FormGroup({});
  isBusy = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      departmentId: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      accountNumber: ['', Validators.required],
      workEmail: ['', Validators.required],
      bankId: ['', Validators.required],
      pfa: ['', Validators.required],
      taxId: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  get formRawValue(): any {
    return this.form.getRawValue();
  }

  // onSubmit() {
  //   this.isBusy = true;
  //   if (this.form.invalid) {
  //     this.isBusy = false;
  //     return;
  //   }
  //   if (this.form.valid) {
  //     //Make api call here...
  //     this.payrollService.createEmployee(this.formRawValue).subscribe(
  //       ({ message, data }) => {
  //         this.toastr.success(message, "Message");
  //         this.form.reset();
  //         this.router.navigate(["/portal/dashboard"], {
  //           queryParams: { id: data.projectId },
  //         });
  //       },
  //       (error) => {
  //         this.isBusy = false;
  //         this.toastr.error(error, "Message", {
  //           timeOut: 3000,
  //         });
  //       },
  //       () => {
  //         this.isBusy = false;
  //         this.form.reset();
  //       }
  //     );
  //   }
  // }
}
