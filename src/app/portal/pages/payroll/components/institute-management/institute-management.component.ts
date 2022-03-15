import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ObservableInput, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PayrollService } from 'src/app/portal/services/payroll.service';
import * as _helperFunc from 'src/app/portal/shared/_helperFunctions';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-institute-management',
  templateUrl: './institute-management.component.html',
  styleUrls: ['./institute-management.component.scss'],
})
export class InstituteManagementComponent implements OnInit {
  @ViewChild('closebtn') closebtn: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  institutionList: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  emptyState: any;
  isBusy: boolean = false;
  itemDetails: any;

  public dataSource: MatTableDataSource<any> = new MatTableDataSource();

  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];
  constructor(
    private payrollServ: PayrollService,
    private toastr: ToastrService
  ) {}

  ngAfterViewInit() {}
  ngOnInit(): void {
    this.getInstitution();
    this.displayedColumns = this.column;
    this.displayedColumns = this.displayedColumns.concat(['action']);
  }

  column = [
    'institution Name',
    'institution Category',
    'account Name',
    'account Number',
    'bank',
    'created On',
  ];
  ngOnChanges() {}
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
  concatColumnString(colString: string) {
    let strtext = colString;
    const myArray = strtext.split(' ');
    return myArray.join('');
  }

  getItemDetails(id: any) {
    if (id !== undefined) {
      this.payrollServ
        .fetchInstitutionDetails(id)
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
  getInstitution() {
    let model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage,
      search: '',
      sortColumn: '',
      sortOrder: 1,
      filter: {
        instituteCategoryId: null,
        bankId: null,
        created: null,
      },
    };
    this.payrollServ
      .fetchAllInstitution(model)
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe(
        (res) => {
          const { result } = res;
          const { data, pagination } = result;
          this.institutionList = data;
          this.dataSource = new MatTableDataSource(this.institutionList);
          this.dataSource.paginator = this.paginator;
        },
        (errors) => {
          this.emptyState = errors;
        }
      );
  }
  confirmDelete() {
    this.isBusy = true;

    if (this.itemDetails !== undefined) {
      this.payrollServ
        .deleteInstitution(this.itemDetails.institutionId)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe(({ message }) => {
          this.isBusy = false;
          this.toastr.success(message, 'Success');
          this.closebtn._elementRef.nativeElement.click();
          this.getInstitution();
        });
    }
  }
}
