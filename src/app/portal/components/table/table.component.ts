import { Component, Input, OnInit } from '@angular/core';
import {
  getFriendlyMap,
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
  @Input() _identifier;
  employeeData: any[];
  selectedItems: any[] = [];
  isDisabled: boolean = false;
  allChecked: boolean = false;
  indeterminate: boolean = false;
  constructor() {}

  ngOnInit(): void {
    this.employeeData = getFriendlyMap(this._data);
  }

  toggleCheck(event: any) {
    let checkedItems = 0;

    let data = {
      ...event.source.value,
      isSelected: true,
    };

    if (event.checked) {
      this.selectedItems.push(data);
      console.log(this.selectedItems);

      checkedItems = this.selectedItems.filter((x) => x.isSelected).length;
      if (checkedItems < this.employeeData.length) {
        this.indeterminate = true;
      } else {
        this.allChecked = true;
        this.indeterminate = false;
      }
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
    this.selectedItems = handleCheckedData(checked, this.employeeData);
  }
}
