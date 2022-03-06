import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
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
  @ViewChild('masterCheck') masterCheck: any;
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
    let id = parseInt(_id);
    let index = _index;
    let data: object;
    if (event.checked) {
      data = {
        ...event.source.value,
        isSelected: event.checked,
      };

      this.selectedItems.push(data);
      let unique = this.selectedItems.filter(
        (v, i, a) => a.findIndex((t) => t.id === v.id) === i
      );
      this.selectedItems = unique;
      this.setCheckedSourceData(_types, index);
    } else {
      let removeIndex = this.selectedItems
        .map((item) => {
          return parseInt(item.id);
        })
        .indexOf(id);
      this.selectedItems.splice(removeIndex, 1);
      this.removeTblBgRenderer(index);
    }
    this.setToggleState(event.checked);
  }

  masterChecked(event: any) {
    let source = this.verifySource();
    this.selectedItems = _helperFunc.handleCheckedData(event, source);
    this.setMasterCheckboxToggleState(event);
  }
  checkSourceData(type: string, index: number) {
    let data: any;
    let checkedItems = this.selectedItems.filter((x) => x.isSelected).length;
    switch (type) {
      case (type = _types.EMPLOYEES):
        data = this.employeeData;
        this.setTableRowHighlighlightColor(checkedItems, data, index);
      case (type = _types.INSTITUTION):
        data = this.institutionData;
        this.setTableRowHighlighlightColor(checkedItems, data, index);
      case (type = _types.PAYELEMENTS):
        data = this.payElementsData;
        this.setTableRowHighlighlightColor(checkedItems, data, index);
      case (type = _types.PAYSCALE):
        data = this.payScaleData;
        this.setTableRowHighlighlightColor(checkedItems, data, index);
      case (type = _types.EMPLOYEESONPAYSCALE):
        data = this.employeesOnPayscaleData;
        this.setTableRowHighlighlightColor(checkedItems, data, index);
      case (type = _types.EMPLOYEESONPAYSCALEPAYROLL):
        data = this.employeesOnPayscalePayrollData;
        this.setTableRowHighlighlightColor(checkedItems, data, index);
      case (type = _types.EMPLOYEESONGROSSPAYROLL):
        data = this.employeesOnGrossPayrollData;
        this.setTableRowHighlighlightColor(checkedItems, data, index);
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
  setTableRowHighlighlightColor(checkedItems: any, data: any, index) {
    if (checkedItems < data.length) {
      this.addTblBgRenderer(index);
    } else {
      this.addTblBgRenderer(index);
    }
  }
  verifySource() {
    let source =
      this._identifier === _types.INSTITUTION
        ? this.institutionData
        : this._identifier === _types.EMPLOYEES ||
          this._identifier === _types.EMPLOYEEPAYSCALE
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
    return source;
  }
  setMasterCheckboxToggleState(event: any) {
    if (event.checked) {
      this.masterCheck.value = true;
      this.masterCheck._checked = true;
      this.masterCheck._indeterminate = null;
      this.selectedItems.map((_, i) => {
        this.addTblBgRenderer(i);
      });
    } else {
      this.masterCheck.value = false;
      this.masterCheck._checked = false;
      this.masterCheck._indeterminate = null;
      this.tblRows._results.map((x: any) => {
        this.renderer.removeClass(x.nativeElement, 'bg-wrap');
      });
    }
  }
  setCheckedSourceData(types: any, index) {
    this.checkSourceData(types.EMPLOYEES, index);
    this.checkSourceData(types.INSTITUTION, index);
    this.checkSourceData(types.PAYELEMENTS, index);
    this.checkSourceData(types.PAYSCALE, index);
    this.checkSourceData(types.EMPLOYEESONPAYSCALE, index);
    this.checkSourceData(types.EMPLOYEESONPAYSCALEPAYROLL, index);
    this.checkSourceData(types.EMPLOYEESONGROSSPAYROLL, index);
  }
  setToggleState(event: any) {
    let dataLngth = this._data.length;
    if (event) {
      if (this.selectedItems.length < dataLngth) {
        this.masterCheck.value = false;
        this.masterCheck._checked = false;
        this.masterCheck._indeterminate = true;
      }
      if (this.selectedItems.length === dataLngth) {
        this.masterCheck._indeterminate = null;
      }
    } else {
      if (this.selectedItems.length !== dataLngth) {
        this.masterCheck.value = true;
        this.masterCheck._checked = true;
        this.masterCheck._indeterminate = true;
      }
      if (this.selectedItems.length < dataLngth) {
        this.masterCheck.value = false;
        this.masterCheck._checked = false;
        this.masterCheck._indeterminate = true;
      }
      if (this.selectedItems.length === 0) {
        this.masterCheck.value = null;
        this.masterCheck._checked = null;
        this.masterCheck._indeterminate = null;
      }
    }
  }
}
