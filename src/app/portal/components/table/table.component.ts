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
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() _data: any;
  @Input() _identifier: string;
  @Input() runByItem;
  selectedItems: any[] = [];
  payScale: string = '';
  runBy: string;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  displayedColumns: string[];

  constructor() {}

  ngOnInit(): void {
    this.displayedColumns = _helperFunc.getTableColumn(this._identifier);
    this.dataSource = new MatTableDataSource(this._data);
  }

  ngAfterViewInit() {}

  //Grab checkbox value here...
  toggleCheck(event: any, index: any) {}

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  handlePayAssignee(event: any) {
    this.payScale = event.source._value;
  }
}
