import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ObservableInput, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NetworkService } from './services/network.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'smartace';
  isConnected;
  constructor(
    private networkServ: NetworkService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.checkConnection();
  }

  checkConnection() {
    this.networkServ.checkNetworkOnline().subscribe((res) => {
      if (!res) {
        this.toastr.error('Network problem', 'No internet connection!', {
          timeOut: 5000,
        });
      }
    });
  }
}
