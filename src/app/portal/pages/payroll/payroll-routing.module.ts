import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignPayscaleComponent } from './components/assign-payscale/assign-payscale.component';
import { CreateNewEmployeeComponent } from './components/create-new-employee/create-new-employee.component';
import { CreatePayElementComponent } from './components/create-pay-element/create-pay-element.component';
import { CreatePayScaleComponent } from './components/create-pay-scale/create-pay-scale.component';
import { CreatePaymentInstitutionComponent } from './components/create-payment-institution/create-payment-institution.component';
import { GrossNetpayComponent } from './components/gross-netpay/gross-netpay.component';
import { InstituteManagementComponent } from './components/institute-management/institute-management.component';
import { PayElementsComponent } from './components/pay-elements/pay-elements.component';
import { PayScaleComponent } from './components/pay-scale/pay-scale.component';
import { PayrollRunlogComponent } from './components/payroll-runlog/payroll-runlog.component';
import { PayrollSettingsComponent } from './components/payroll-settings/payroll-settings.component';
import { PayscaleSetupComponent } from './components/payscale-setup/payscale-setup.component';
import { PayscheduleSetupComponent } from './components/payschedule-setup/payschedule-setup.component';
import { PayslipComponent } from './components/payslip/payslip.component';
import { QuickPayrollComponent } from './components/quick-payroll/quick-payroll.component';
import { ReportComponent } from './components/report/report.component';
import { ReviewEmployeePayrollComponent } from './components/review-employee-payroll/review-employee-payroll.component';
import { TaxTypeComponent } from './components/tax-type/tax-type.component';
import { ViewPayscaleComponent } from './components/view-payscale/view-payscale.component';
import { PayrollComponent } from './payroll.component';

const routes: Routes = [
  {
    path: '',
    component: PayrollComponent,
    children: [
      {
        path: 'institute-management',
        component: InstituteManagementComponent,
      },
      {
        path: 'pay-elements',
        component: PayElementsComponent,
      },
      {
        path: 'pay-scale',
        component: PayScaleComponent,
      },
      {
        path: 'add-employee',
        component: CreateNewEmployeeComponent,
      },
      {
        path: 'payscale-setup',
        component: PayscaleSetupComponent,
      },
      {
        path: 'institution-payment-setup',
        component: CreatePaymentInstitutionComponent,
      },
      {
        path: 'pay-element-setup',
        component: CreatePayElementComponent,
      },
      {
        path: 'pay-scale-setup',
        component: CreatePayScaleComponent,
      },
      {
        path: 'view-payscale',
        component: ViewPayscaleComponent,
      },
      {
        path: 'quick-payroll',
        component: QuickPayrollComponent,
      },
      {
        path: 'review-payroll',
        component: ReviewEmployeePayrollComponent,
      },
      {
        path: 'assign-payscale',
        component: AssignPayscaleComponent,
      },
      {
        path: 'view-payslip',
        component: PayslipComponent,
      },
      {
        path: 'payroll-run-log',
        component: PayrollRunlogComponent,
      },
      {
        path: 'gross-netpay',
        component: GrossNetpayComponent,
      },
      {
        path: 'tax-type',
        component: TaxTypeComponent,
      },
      {
        path: 'report',
        component: ReportComponent,
      },
      {
        path: 'payschedule-setup',
        component: PayscheduleSetupComponent,
      },
      {
        path: 'payroll-settings',
        component: PayrollSettingsComponent,
      },
      {
        path: '',
        redirectTo: 'institute-management',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollRoutingModule {}
