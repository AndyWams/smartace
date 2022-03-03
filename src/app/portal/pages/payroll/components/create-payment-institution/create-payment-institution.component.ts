import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
@Component({
  selector: 'app-create-payment-institution',
  templateUrl: './create-payment-institution.component.html',
  styleUrls: ['./create-payment-institution.component.scss'],
})
export class CreatePaymentInstitutionComponent implements OnInit {
  queryString: string = '';
  categoryType: string = 'predefined';
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(filter((params) => params.query))
      .subscribe((params) => {
        this.queryString = params.query;
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/payroll/institute-management']);
    }
  }
  handleCategorySelect(event: any) {
    this.categoryType = event.target.value;
  }
}
