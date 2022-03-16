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
import { ITaxType } from 'src/app/portal/models';

@Component({
  selector: 'app-tax-type',
  templateUrl: './tax-type.component.html',
  styleUrls: ['./tax-type.component.scss'],
})
export class TaxTypeComponent implements OnInit {
  @ViewChild('closebtn') closebtn: any;
  @ViewChild('closebtn_') closebtn_: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  taxList: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  emptyState: any;
  isBusy: boolean = false;
  itemDetails: any;
  public updateTaxTypeForm: FormGroup = new FormGroup({});
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();

  public selection = new SelectionModel(true, []);
  public displayedColumns: string[];
  constructor(
    private payrollServ: PayrollService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}
  column = ['tax Name', 'tax Percentage', 'created On'];
  ngOnInit(): void {
    this.getTaxTypes();
    this.displayedColumns = this.column;
    this.displayedColumns = this.displayedColumns.concat(['action']);
  }
  get value_(): ITaxType {
    return this.updateTaxTypeForm.getRawValue();
  }

  toggleCheck() {
    // console.log(this.selection.selected);
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
        .fetchTaxTypeDetails(id)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe((res) => {
          const { result } = res;
          this.itemDetails = result;
          this.setFormControlElement();
        });
    }
  }
  getTaxTypes() {
    let model = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      search: '',
      sortColumn: '',
      sortOrder: 1,
    };
    this.payrollServ
      .fetchAllTaxTypes(model)
      .pipe(
        catchError((err: any): ObservableInput<any> => {
          return throwError(err);
        })
      )
      .subscribe(
        (res) => {
          const { result } = res;
          const { data, pagination } = result;
          this.taxList = data;
          this.dataSource = new MatTableDataSource(this.taxList);
          this.dataSource.paginator = this.paginator;
        },
        (errors) => {
          this.emptyState = errors;
        }
      );
  }
  setFormControlElement() {
    this.updateTaxTypeForm = this.fb.group({
      taxName: [this.itemDetails.taxName, Validators.required],
      taxPercentage: [this.itemDetails.taxPercentage, Validators.required],
      taxId: [this.itemDetails.taxId],
    });
  }
  confirmDelete() {
    this.isBusy = true;
    if (this.itemDetails !== undefined) {
      this.payrollServ
        .deleteTaxType(this.itemDetails.taxId)
        .pipe(
          catchError((err: any): ObservableInput<any> => {
            return throwError(err);
          })
        )
        .subscribe(({ message }) => {
          this.isBusy = false;
          this.toastr.success(message, 'Success');
          this.closebtn._elementRef.nativeElement.click();
          this.getTaxTypes();
        });
    }
  }
  onUpdate() {
    this.isBusy = true;
    if (this.updateTaxTypeForm.valid) {
      this.payrollServ.updateTaxType(this.value_).subscribe(
        ({ message }) => {
          this.toastr.success(message, 'Message');
          this.updateTaxTypeForm.reset();
          this.closebtn_._elementRef.nativeElement.click();
          this.getTaxTypes();
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.updateTaxTypeForm.reset();
        }
      );
    }
  }
}
