import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrossNetpayComponent } from './components/gross-netpay/gross-netpay.component';
import { InstituteManagementComponent } from './components/institute-management/institute-management.component';
import { PayElementsComponent } from './components/pay-elements/pay-elements.component';
import { PayScaleComponent } from './components/pay-scale/pay-scale.component';
import { PayrollRunlogComponent } from './components/payroll-runlog/payroll-runlog.component';
import { PayrollSettingsComponent } from './components/payroll-settings/payroll-settings.component';
import { PayscaleSetupComponent } from './components/payscale-setup/payscale-setup.component';
import { PayscheduleSetupComponent } from './components/payschedule-setup/payschedule-setup.component';
import { QuickPayrollComponent } from './components/quick-payroll/quick-payroll.component';
import { ReportComponent } from './components/report/report.component';
import { TaxTypeComponent } from './components/tax-type/tax-type.component';
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
        path: 'quick-payroll',
        component: QuickPayrollComponent,
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
        path: 'payscale-setup',
        component: PayscaleSetupComponent,
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
