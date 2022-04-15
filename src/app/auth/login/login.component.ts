import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IAuth } from 'src/app/portal/shared/model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  show: boolean = false;
  isBusy: boolean = false;
  public form: FormGroup = new FormGroup({});
  constructor(
    private authServ: AuthService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      clientId: [],
    });
  }

  ngOnInit(): void {}
  password() {
    this.show = !this.show;
  }

  get value(): IAuth {
    return this.form.getRawValue();
  }

  onSubmit() {
    this.isBusy = true;
    if (this.form.valid) {
      this.authServ.login(this.value).subscribe(
        ({ message, result }) => {
          this.toastr.success(message, 'Message');
          this.form.reset();
          localStorage.setItem('token', result.token);
          this.router.navigate(['/portal/dashboard']);
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message', {
            timeOut: 3000,
          });
        },
        () => {
          this.isBusy = false;
          this.form.reset();
        }
      );
    }
  }
}
