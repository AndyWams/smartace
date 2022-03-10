import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayrollRoutingModule } from './payroll-routing.module';
import { PayrollComponent } from './payroll.component';
import { AngularMaterialModule } from '../../shared/angular-material.module';
import { InstituteManagementComponent } from './components/institute-management/institute-management.component';
import { PayElementsComponent } from './components/pay-elements/pay-elements.component';
import { PayScaleComponent } from './components/pay-scale/pay-scale.component';
import { QuickPayrollComponent } from './components/quick-payroll/quick-payroll.component';
import { PayrollRunlogComponent } from './components/payroll-runlog/payroll-runlog.component';
import { GrossNetpayComponent } from './components/gross-netpay/gross-netpay.component';
import { TaxTypeComponent } from './components/tax-type/tax-type.component';
import { ReportComponent } from './components/report/report.component';
import { PayscaleSetupComponent } from './components/payscale-setup/payscale-setup.component';
import { PayscheduleSetupComponent } from './components/payschedule-setup/payschedule-setup.component';
import { PayrollSettingsComponent } from './components/payroll-settings/payroll-settings.component';
import { TableComponent } from '../../components/table/table.component';
import { CreatePaymentInstitutionComponent } from './components/create-payment-institution/create-payment-institution.component';
import { CreateNewEmployeeComponent } from './components/create-new-employee/create-new-employee.component';
import { CreatePayElementComponent } from './components/create-pay-element/create-pay-element.component';
import { CreatePayScaleComponent } from './components/create-pay-scale/create-pay-scale.component';
import { ViewPayscaleComponent } from './components/view-payscale/view-payscale.component';
import { ReviewEmployeePayrollComponent } from './components/review-employee-payroll/review-employee-payroll.component';
import { AssignPayscaleComponent } from './components/assign-payscale/assign-payscale.component';
import { ModalsComponent } from '../../components/modals/modals.component';
import { PayslipComponent } from './components/payslip/payslip.component';
import { PayrollDetailsComponent } from './components/payroll-details/payroll-details.component';
import { PayslipAnalysisComponent } from './components/payslip-analysis/payslip-analysis.component';
import { PayrollAnalysisComponent } from './components/payroll-analysis/payroll-analysis.component';
import { ChartGraphModule } from '../../components/chart-graph/chart-graph.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ComputeGrossComponent } from './components/compute-gross/compute-gross.component';
@NgModule({
  declarations: [
    PayrollComponent,
    InstituteManagementComponent,
    PayElementsComponent,
    PayScaleComponent,
    QuickPayrollComponent,
    PayrollRunlogComponent,
    GrossNetpayComponent,
    TaxTypeComponent,
    ReportComponent,
    PayscaleSetupComponent,
    PayscheduleSetupComponent,
    PayrollSettingsComponent,
    TableComponent,
    CreatePaymentInstitutionComponent,
    CreateNewEmployeeComponent,
    CreatePayElementComponent,
    CreatePayScaleComponent,
    ViewPayscaleComponent,
    ReviewEmployeePayrollComponent,
    AssignPayscaleComponent,
    ModalsComponent,
    PayslipComponent,
    PayrollDetailsComponent,
    PayslipAnalysisComponent,
    PayrollAnalysisComponent,
    ComputeGrossComponent,
  ],
  imports: [
    CommonModule,
    PayrollRoutingModule,
    AngularMaterialModule,
    ChartGraphModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
    }),
  ],
  providers: [{ provide: ToastrService }],
  exports: [PayrollComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PayrollModule {}
