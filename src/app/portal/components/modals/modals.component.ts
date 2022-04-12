import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, ObservableInput, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PayrollService } from '../../services/payroll.service';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.scss'],
})
export class ModalsComponent implements OnInit {
  @ViewChild('closebtn') closebtn: any;
  @Input() runByItem;
  @Input() itemDetails: any;
  payChannel: string = 'Master';

  isBusy: boolean = false;
  constructor(
    private payrollServ: PayrollService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}
  ngOnChanges() {
    this.itemDetails; //Watch for changes
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
        });
    }
  }
}
