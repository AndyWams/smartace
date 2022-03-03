import { Component, Input, OnInit } from '@angular/core';
import {
  getEmployeeDataMap,
  getInstitutionDataMap,
  getPayElementsDataMap,
  getPayScaleDataMap,
  handleCheckedData,
} from '../../shared/_helperFunctions';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() _tblHeader: any;
  @Input() _data: any;
  @Input() _identifier: string;
  employeeData: any[];
  institutionData: any[];
  payElementsData: any[];
  payScaleData: any[];
  employeesOnPayscaleData: any[];
  selectedItems: any[] = [];
  isDisabled: boolean = false;
  allChecked: boolean = false;
  indeterminate: boolean = false;
  constructor() {}

  ngOnInit(): void {
    this.employeeData = getEmployeeDataMap(this._data);
    this.employeesOnPayscaleData = getEmployeeDataMap(this._data);
    this.institutionData = getInstitutionDataMap(this._data);
    this.payElementsData = getPayElementsDataMap(this._data);
    this.payScaleData = getPayScaleDataMap(this._data);
  }

  toggleCheck(event: any) {
    let checkedItems = 0;
    let data = {
      ...event.source.value,
      isSelected: true,
    };

    if (event.checked) {
      this.selectedItems.push(data);
      checkedItems = this.selectedItems.filter((x) => x.isSelected).length;
      this.checkSourceData('Employee');
      this.checkSourceData('Institution');
      this.checkSourceData('PayElements');
      this.checkSourceData('PayScale');
      this.checkSourceData('EmpOnPayScale');
    } else {
      checkedItems = this.selectedItems.filter((x) => x.isSelected).length;
      checkedItems = checkedItems - 1;
      if (checkedItems <= this.selectedItems.length) {
        this.allChecked = false;
        this.indeterminate = true;
      }
      if (checkedItems == 0) {
        this.indeterminate = null;
        this.allChecked = null;
      }
      let index = this.selectedItems.indexOf(data);
      if (index === -1) {
        this.selectedItems.splice(index, 1);
      }
    }

    return this.selectedItems;
  }

  setAll(checked: boolean) {
    let source =
      this._identifier === 'inst_mgmt'
        ? this.institutionData
        : this._identifier === 'employees'
        ? this.employeeData
        : this._identifier === 'pay_elements'
        ? this.payElementsData
        : this._identifier === 'pay_scale'
        ? this.payScaleData
        : this._identifier === 'employees_on_payscale'
        ? this.employeesOnPayscaleData
        : null;
    this.selectedItems = handleCheckedData(checked, source);
  }

  checkSourceData(type: string) {
    let data: any;
    let checkedItems = this.selectedItems.filter((x) => x.isSelected).length;
    switch (type) {
      case (type = 'Employee'):
        data = this.employeeData;
        if (checkedItems < data.length) {
          this.indeterminate = true;
        } else {
          this.allChecked = true;
          this.indeterminate = false;
        }
      case (type = 'Institution'):
        data = this.institutionData;
        if (checkedItems < data.length) {
          this.indeterminate = true;
        } else {
          this.allChecked = true;
          this.indeterminate = false;
        }
      case (type = 'PayElements'):
        data = this.payElementsData;
        if (checkedItems < data.length) {
          this.indeterminate = true;
        } else {
          this.allChecked = true;
          this.indeterminate = false;
        }
      case (type = 'PayScale'):
        data = this.payScaleData;
        if (checkedItems < data.length) {
          this.indeterminate = true;
        } else {
          this.allChecked = true;
          this.indeterminate = false;
        }
      case (type = 'EmpOnPayScale'):
        data = this.employeesOnPayscaleData;
        if (checkedItems < data.length) {
          this.indeterminate = true;
        } else {
          this.allChecked = true;
          this.indeterminate = false;
        }
      default:
        return null;
    }
  }
}
