import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartGraphComponent } from './chart-graph.component';
import { ChartsModule, WavesModule } from 'angular-bootstrap-md';
import { AngularMaterialModule } from '../../shared/angular-material.module';

@NgModule({
  declarations: [ChartGraphComponent],
  imports: [CommonModule, ChartsModule, WavesModule, AngularMaterialModule],
  exports: [ChartGraphComponent],
})
export class ChartGraphModule {}
