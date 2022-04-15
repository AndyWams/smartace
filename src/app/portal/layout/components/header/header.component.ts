import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  profileName: any;
  constructor(private authServ: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.profileName = this.authServ.getUserData().ProfileName;
  }
  logout() {
    this.authServ.logout();
    this.router.navigate(['/']);
  }
}
