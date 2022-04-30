import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyStateComponent } from './empty-state.component';
import { AngularMaterialModule } from '../../shared/angular-material.module';

@NgModule({
  declarations: [EmptyStateComponent],
  imports: [CommonModule, AngularMaterialModule],
  exports: [EmptyStateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmptyStateModule {}
