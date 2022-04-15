import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ObservableInput, throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { PayrollService } from 'src/app/portal/services/payroll.service';
import * as _helperFunc from 'src/app/portal/shared/_helperFunctions';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import {
  getElementTypeValue,
  printElement,
} from 'src/app/portal/shared/_helperFunctions';

@Component({
  selector: 'app-gross-netpay',
  templateUrl: './gross-netpay.component.html',
  styleUrls: ['./gross-netpay.component.scss'],
})
export class GrossNetpayComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  grossList: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  emptyState: any;
  noRecord: boolean = false;
  isBusy: boolean = false;
  show_ref: boolean = false;
  payrollId: any;
  itemDetails: any;
  payElementBreakdown: any[] = [];
  _printElement = printElement;
  elementTypeValue = getElementTypeValue;
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  constructor(
    private payrollServ: PayrollService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getGrossNet();
    this.displayedColumns = this.column;
  }
  column = [
    'name',
    'gross ID',
    'department',
    'monthly earning',
    'monthly deduction',
    'net pay',
    'action',
  ];

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

  getGrossNet() {
    let model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage,
      search: '',
      sortColumn: '',
      sortOrder: 1,
    };
    this.payrollServ
      .getGrossNet(model)
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe(
        (res) => {
          const { result } = res;
          this.grossList = result;
          this.dataSource = new MatTableDataSource(this.grossList);
          this.dataSource.paginator = this.paginator;
          this.show_ref = false;
        },
        (errors) => {
          this.emptyState = errors;
          if (this.emptyState) {
            this.grossList = [];
          }
        }
      );
  }
  getItemDetails(obj: any) {
    if (obj !== undefined) {
      this.payrollServ
        .getGrossNetBreakdown(obj)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe((res) => {
          const { result } = res;
          this.itemDetails = result;
          this.payElementBreakdown = this.itemDetails.items;
        });
    }
  }
}
