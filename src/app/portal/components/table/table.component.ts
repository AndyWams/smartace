import {
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
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
  @ViewChildren('tbl_Rows') tblRows: any;
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
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.employeeData = getEmployeeDataMap(this._data);
    this.employeesOnPayscaleData = getEmployeeDataMap(this._data);
    this.institutionData = getInstitutionDataMap(this._data);
    this.payElementsData = getPayElementsDataMap(this._data);
    this.payScaleData = getPayScaleDataMap(this._data);
  }
  ngAfterViewInit() {}

  toggleCheck(event: any, index: number) {
    let checkedItems = 0;

    let i = index;

    let data = {
      ...event.source.value,
      isSelected: true,
    };

    if (event.checked) {
      this.selectedItems.push(data);
      checkedItems = this.selectedItems.filter((x) => x.isSelected).length;
      this.checkSourceData('Employee', i);
      this.checkSourceData('Institution', i);
      this.checkSourceData('PayElements', i);
      this.checkSourceData('PayScale', i);
      this.checkSourceData('EmpOnPayScale', i);
    } else {
      checkedItems = this.selectedItems.filter((x) => x.isSelected).length;
      checkedItems = checkedItems - 1;
      if (checkedItems <= this.selectedItems.length) {
        this.allChecked = false;
        this.indeterminate = true;
        this.removeTblBgRenderer(i);
      }
      if (checkedItems == 0) {
        this.indeterminate = null;
        this.allChecked = null;
        this.removeTblBgRenderer(i);
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
        : '';
    this.selectedItems = handleCheckedData(checked, source);
    if (this.selectedItems.length) {
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
      case (type = 'Employee'):
        data = this.employeeData;
        this.getSwitch(checkedItems, data, index);
      case (type = 'Institution'):
        data = this.institutionData;
        this.getSwitch(checkedItems, data, index);
      case (type = 'PayElements'):
        data = this.payElementsData;
        this.getSwitch(checkedItems, data, index);
      case (type = 'PayScale'):
        data = this.payScaleData;
        this.getSwitch(checkedItems, data, index);
      case (type = 'EmpOnPayScale'):
        data = this.employeesOnPayscaleData;
        this.getSwitch(checkedItems, data, index);
      default:
        return null;
    }
  }
  addTblBgRenderer(index: number) {
    return this.renderer.addClass(
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
