import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AngularMaterialModule } from '../../shared/angular-material.module';
import { OverviewComponent } from './components/overview/overview.component';
import { PayrollEventsComponent } from './components/payroll-events/payroll-events.component';
import { ChartGraphModule } from '../../components/chart-graph/chart-graph.module';

@NgModule({
  declarations: [DashboardComponent, OverviewComponent, PayrollEventsComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    AngularMaterialModule,
    ChartGraphModule,
  ],
  exports: [DashboardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule {}
