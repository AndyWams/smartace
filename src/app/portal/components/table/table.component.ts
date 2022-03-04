import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChildren,
} from '@angular/core';

import * as _helperFunc from '../../shared';
import * as _types from '../../shared';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @ViewChildren('tbl_Rows') tblRows: any;
  @Input() _tblHeader: any;
  @Input() _data: any;
  @Input() _identifier: string;
  employeeData: any[];
  institutionData: any[];
  payElementsData: any[];
  payScaleData: any[];
  employeesOnPayscaleData: any[];
  employeesOnGrossPayrollData: any[];
  employeesOnPayscalePayrollData: any[];
  selectedItems: any[] = [];
  allChecked: boolean = false;
  indeterminate: boolean = false;
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.employeeData = _helperFunc.getEmployeeDataMap(this._data);
    this.employeesOnPayscaleData = _helperFunc.getEmployeeDataMap(this._data);
    this.employeesOnPayscalePayrollData =
      _helperFunc.getEmployeePayScalePayrollDataMap(this._data);
    this.employeesOnGrossPayrollData =
      _helperFunc.getEmployeeGrossPayrollDataMap(this._data);
    this.institutionData = _helperFunc.getInstitutionDataMap(this._data);
    this.payElementsData = _helperFunc.getPayElementsDataMap(this._data);
    this.payScaleData = _helperFunc.getPayScaleDataMap(this._data);
  }
  ngAfterViewInit() {}

  toggleCheck(event: any, _id: any, _index: number) {
    let checkedItems = 0;

    let id = parseInt(_id);
    let index = _index;

    let data = {
      ...event.source.value,
      isSelected: true,
    };

    if (event.checked) {
      this.selectedItems.push(data);
      this.checkSourceData(_types.EMPLOYEES, index);
      this.checkSourceData(_types.INSTITUTION, index);
      this.checkSourceData(_types.PAYELEMENTS, index);
      this.checkSourceData(_types.PAYSCALE, index);
      this.checkSourceData(_types.EMPLOYEESONPAYSCALE, index);
      this.checkSourceData(_types.EMPLOYEESONPAYSCALEPAYROLL, index);
      this.checkSourceData(_types.EMPLOYEESONGROSSPAYROLL, index);
    } else {
      let removeIndex = this.selectedItems
        .map((item) => {
          return parseInt(item.id);
        })
        .indexOf(id);
      // remove object
      this.selectedItems.splice(removeIndex, 1);
      this.allChecked = false;
      this.indeterminate = true;
      this.removeTblBgRenderer(index);
      if (this.selectedItems.length === 0) {
        this.allChecked = null;
        this.indeterminate = false;
      }
    }
  }

  setAll(checked: boolean) {
    let source =
      this._identifier === _types.INSTITUTION
        ? this.institutionData
        : this._identifier === _types.EMPLOYEES
        ? this.employeeData
        : this._identifier === _types.PAYELEMENTS
        ? this.payElementsData
        : this._identifier === _types.PAYSCALE
        ? this.payScaleData
        : this._identifier === _types.EMPLOYEESONPAYSCALE
        ? this.employeesOnPayscaleData
        : this._identifier === _types.EMPLOYEESONPAYSCALEPAYROLL
        ? this.employeesOnPayscalePayrollData
        : this._identifier === _types.EMPLOYEESONGROSSPAYROLL
        ? this.employeesOnGrossPayrollData
        : null;
    this.selectedItems = _helperFunc.handleCheckedData(checked, source);
    if (this.selectedItems.length && checked) {
      this.selectedItems.map((_, i) => {
        this.addTblBgRenderer(i);
      });
    } else {
      this.tblRows._results.map((x: any) => {
        this.renderer.removeClass(x.nativeElement, 'bg-wrap');
      });
    }
  }

  checkSourceData(type: string, index: number) {
    let data: any;
    let checkedItems = this.selectedItems.filter((x) => x.isSelected).length;
    switch (type) {
      case (type = _types.EMPLOYEES):
        data = this.employeeData;
        this.getSwitch(checkedItems, data, index);
      case (type = _types.INSTITUTION):
        data = this.institutionData;
        this.getSwitch(checkedItems, data, index);
      case (type = _types.PAYELEMENTS):
        data = this.payElementsData;
        this.getSwitch(checkedItems, data, index);
      case (type = _types.PAYSCALE):
        data = this.payScaleData;
        this.getSwitch(checkedItems, data, index);
      case (type = _types.EMPLOYEESONPAYSCALE):
        data = this.employeesOnPayscaleData;
        this.getSwitch(checkedItems, data, index);
      case (type = _types.EMPLOYEESONPAYSCALEPAYROLL):
        data = this.employeesOnPayscalePayrollData;
        this.getSwitch(checkedItems, data, index);
      case (type = _types.EMPLOYEESONGROSSPAYROLL):
        data = this.employeesOnGrossPayrollData;
        this.getSwitch(checkedItems, data, index);
      default:
        return null;
    }
  }
  addTblBgRenderer(index: number) {
    this.renderer.addClass(
      this.tblRows._results[index].nativeElement,
      'bg-wrap'
    );
  }
  removeTblBgRenderer(index: number) {
    return this.renderer.removeClass(
      this.tblRows._results[index].nativeElement,
      'bg-wrap'
    );
  }
  getSwitch(checkedItems: any, data: any, index) {
    if (checkedItems < data.length) {
      this.indeterminate = true;
      this.addTblBgRenderer(index);
    } else {
      this.allChecked = true;
      this.indeterminate = false;
      this.addTblBgRenderer(index);
    }
  }
}
