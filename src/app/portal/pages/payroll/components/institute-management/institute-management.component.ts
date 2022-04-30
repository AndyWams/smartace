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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { printElement } from 'src/app/portal/shared/_helperFunctions';
import { ExportServiceService } from 'src/app/portal/services/export-service.service';
@Component({
  selector: 'app-institute-management',
  templateUrl: './institute-management.component.html',
  styleUrls: ['./institute-management.component.scss'],
})
export class InstituteManagementComponent implements OnInit {
  @ViewChild('closebtn') closebtn: any;
  @ViewChild('closebtn_') closebtn_: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  institutionList: any[] = [];
  pageSize: number = 20;
  currentPage = 0;
  noRecord: boolean = false;
  isBusy: boolean = false;
  show_ref: boolean = false;
  itemDetails: any;
  bankList: any[] = [];
  institutionCatList: any[] = [];
  _loading: boolean = false;
  totalRows = 0;
  hidePagenator: boolean = false;
  file_name = 'institution_data';
  _printElement = printElement;
  public filterForm: FormGroup = new FormGroup({});
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];
  constructor(
    private payrollServ: PayrollService,
    private exportService: ExportServiceService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      instituteCategoryId: ['', Validators.required],
      bankId: ['', Validators.required],
      created: [null],
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.getInstitution();
    this.getInstitutionCat();
    this.getBankList();
    this.displayedColumns = this.column;
  }

  column = [
    'institution Name',
    'institution Category',
    'account Name',
    'account Number',
    'bank',
    'created On',
    'actions',
  ];
  ngOnChanges() {
    this.getInstitution();
  }

  get filterFormValue(): any {
    return this.filterForm.getRawValue();
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
  getInstitutionCat() {
    this.payrollServ
      .fetchInstitutionCategory()
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe((res) => {
        const { result } = res;
        this.institutionCatList = result;
      });
  }
  getBankList() {
    this.payrollServ
      .fetchAllBanks()
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe((res) => {
        const { result } = res;
        this.bankList = result;
      });
  }
  getInstitution(sortOrder?: string) {
    this._loading = true;
    this.institutionList = [];
    let model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage + 1,
      search: '',
      sortColumn: sortOrder,
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
          this._loading = false;
          const { result } = res;
          const { data, pagination } = result;
          this.institutionList = data;
          this.dataSource = new MatTableDataSource(this.institutionList);
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = pagination.rowCount;
          this.show_ref = false;
        },
        (errors) => {}
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
  onFilter() {
    this.isBusy = true;
    this._loading = true;
    this.institutionList = [];
    const model = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage + 1,
      search: '',
      sortColumn: '',
      sortOrder: 1,
      filter: {
        instituteCategoryId:
          this.filterForm.controls['instituteCategoryId'].value,
        bankId: this.filterForm.controls['bankId'].value,
        created: this.filterForm.controls['created'].value,
      },
    };
    if (this.filterForm.invalid) {
      this.isBusy = false;
      return;
    }
    if (this.filterForm.valid) {
      this.payrollServ
        .fetchAllInstitution(model)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe(
          (res) => {
            this._loading = false;
            const { result } = res;
            const { data, pagination } = result;
            this.institutionList = data;
            this.dataSource = new MatTableDataSource(this.institutionList);
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = pagination.rowCount;
            this.closebtn_._elementRef.nativeElement.click();
            this.isBusy = false;
            this.noRecord = false;
            this.show_ref = true;
            this.filterForm.reset();
          },
          () => {
            this.isBusy = false;
            this._loading = false;
          },
          () => {
            this.isBusy = false;
            this._loading = false;
            this.noRecord = false;
            this.filterForm.reset();
          }
        );
    }
  }
  getFilterTerm(val: any) {
    this.institutionList = [];
    if (val && val !== null) {
      this.getInstitution(val);
    } else {
      this.getInstitution();
    }
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getInstitution();
  }
  exportToExcel(): void {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        { A: 'INSTITUTION DATA' }, // title
        {
          A: '#',
          B: 'Institution name',
          C: 'Institution category',
          D: 'Account name',
          E: 'Account number',
          F: 'Bank',
          G: 'Created date',
        }, // table header
      ],
      skipHeader: true,
    };
    this.institutionList.forEach((data) => {
      udt.data.push({
        A: data.institutionId,
        B: data.institutionName,
        C: data.institutionCategory.institutionCategoryName,
        D: data.accountName,
        E: data.accountNumber,
        F: data.bank.bankName,
        G: data.createdOn,
      });
    });
    edata.push(udt);
    this.exportService.exportTableElmToExcel(edata, this.file_name);
  }
}
