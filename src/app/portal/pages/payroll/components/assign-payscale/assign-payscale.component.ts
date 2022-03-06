import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { employeeData } from 'src/assets/raw_data';

@Component({
  selector: 'app-assign-payscale',
  templateUrl: './assign-payscale.component.html',
  styleUrls: ['./assign-payscale.component.scss'],
})
export class AssignPayscaleComponent implements OnInit {
  data = employeeData;
  queryString: string;
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getRoutes();
  }
  getRoutes() {
    this.route.queryParams
      .pipe(filter((params) => params.query))
      .subscribe((params) => {
        this.queryString = params.query;
      });
    if (this.queryString === '') {
      this.router.navigate(['/portal/payroll/quick-payroll']);
    }
  }
}
