import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ObservableInput, throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { PayrollService } from 'src/app/portal/services/payroll.service';
import {
  getElementTypeValue,
  getPaymentChannelValue,
} from 'src/app/portal/shared/_helperFunctions';

@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.scss'],
})
export class PayslipComponent implements OnInit {
  payrollId: any;
  employeeId: any;
  itemDetails: any;
  payElementBreakdownList: any[] = [];
  _paymentChannelValue = getPaymentChannelValue;
  elementTypeValue = getElementTypeValue;
  constructor(
    private payrollServ: PayrollService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getRoutes();
  }
  getItemDetails() {
    let model = {
      payrollId: this.payrollId,
      employeeId: this.employeeId,
    };
    if (this.payrollId !== undefined) {
      this.payrollServ
        .getEmployeePaySlip(model)
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
  getRoutes() {
    this.route.queryParams
      .pipe(filter((params) => params.empid))
      .subscribe((params) => {
        this.payrollId = params.payrollId;
        this.employeeId = params.empid;
        console.log(this.employeeId);

        this.getItemDetails();
      });
    if (this.payrollId === '') {
      this.router.navigate(['/portal/payroll/payroll-run-log']);
    }
  }
}
