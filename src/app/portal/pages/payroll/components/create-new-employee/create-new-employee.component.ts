import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PayrollService } from 'src/app/portal/services/payroll.service';
import { ToastrService } from 'ngx-toastr';
import { ObservableInput, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IDepartment } from 'src/app/portal/models';
@Component({
  selector: 'app-create-new-employee',
  templateUrl: './create-new-employee.component.html',
  styleUrls: ['./create-new-employee.component.scss'],
})
export class CreateNewEmployeeComponent implements OnInit {
  @ViewChild('closebtn') closebtn: any;
  public createEmpForm: FormGroup = new FormGroup({});
  public createDeptForm: FormGroup = new FormGroup({});
  isBusy = false;
  isBusy_ = false;
  bankList: any[] = [];
  departmentList: any[] = [];
  constructor(
    private router: Router,
    private payrollServ: PayrollService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.createEmpForm = this.fb.group({
      departmentId: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      employeeNo: ['', Validators.required],
      accountNumber: ['', [Validators.required, Validators.minLength(10)]],
      workEmail: ['', Validators.required],
      bankId: ['', Validators.required],
      pfa: ['', Validators.required],
      taxId: ['', Validators.required],
    });
    this.createDeptForm = this.fb.group({
      departmentName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllBanks();
    this.getDepartments();
  }

  get formRawValue(): any {
    return this.createEmpForm.getRawValue();
  }
  get inputValue(): IDepartment {
    return this.createDeptForm.getRawValue();
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
  getDepartments() {
    this.payrollServ
      .fetchDepartment()
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe((res) => {
        const { result } = res;
        this.departmentList = result;
      });
  }

  onSubmit() {
    this.isBusy = true;
    if (this.createEmpForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.createEmpForm.valid) {
      //Make api call here...
      this.payrollServ.createEmployee(this.formRawValue).subscribe(
        ({ message, data }) => {
          this.toastr.success(message, 'Message');
          this.createEmpForm.reset();
          this.router.navigate(['/portal/dashboard']);
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.createEmpForm.reset();
        }
      );
    }
  }
  onAddDepartment() {
    this.isBusy_ = true;
    if (this.createDeptForm.valid) {
      this.payrollServ.createDepartment(this.inputValue).subscribe(
        ({ message }) => {
          this.toastr.success(message, 'Message');
          this.createDeptForm.reset();
          this.closebtn._elementRef.nativeElement.click();
          this.getDepartments();
        },
        (error) => {
          this.isBusy_ = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy_ = false;
          this.createDeptForm.reset();
        }
      );
    }
  }
}
