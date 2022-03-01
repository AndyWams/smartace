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
  ],
  imports: [CommonModule, PayrollRoutingModule, AngularMaterialModule],
  exports: [PayrollComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PayrollModule {}
