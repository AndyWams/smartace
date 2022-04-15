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
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter } from 'rxjs/operators';
import { PayrollService } from '../../services/payroll.service';
import { ObservableInput, throwError } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  @Input() _data: any;
  @Input() _identifier: string;
  @Input() _reportType: any;
  @Input() runByItem;
  queryString: any;
  selectedItems: any[] = [];
  payScale: string = '';
  runBy: string;
  pageSize: number = 10;
  itemDetails: any;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];

  constructor(
    private payrollServ: PayrollService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.getRoutes();
    this.displayedColumns = _helperFunc.getTableColumn(
      this._identifier,
      this._reportType
    );
    this.processRequiredActionColumn(this.queryString, this._reportType);
    this.dataSource = new MatTableDataSource(this._data);
  }
  ngOnChanges() {}

  processRequiredActionColumn(qrStr: string, repTyp) {
    if (
      qrStr !== 'add' &&
      qrStr !== 'view' &&
      qrStr !== 'edit' &&
      repTyp !== 'Earning Report' &&
      repTyp !== 'Deduction Report' &&
      repTyp !== 'Deduction Summary Report' &&
      repTyp !== 'Payment Summary Report' &&
      repTyp !== 'Tax Details Report' &&
      repTyp !== 'Pension Details Report'
    ) {
      return (this.displayedColumns = this.displayedColumns.concat(['action']));
    }
  }

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
  concatColumnString(colString: string) {
    let strtext = colString;
    const myArray = strtext.split(' ');
    return myArray.join('');
  }

  getRoutes() {
    this.route.queryParams
      .pipe(filter((params) => params.query))
      .subscribe((params) => {
        this.queryString = params.query;
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/payroll']);
    }
  }

  getItemDetails(id: any) {
    if (id !== undefined) {
      this.payrollServ
        .BankScheduleDetails(id)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe((res) => {
          const { result } = res;
          this.itemDetails = result;
        });
    }
  }
}
