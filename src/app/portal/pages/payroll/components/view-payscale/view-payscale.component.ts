import { Component, OnInit } from '@angular/core';
import { employeeData } from 'src/assets/raw_data';

@Component({
  selector: 'app-view-payscale',
  templateUrl: './view-payscale.component.html',
  styleUrls: ['./view-payscale.component.scss'],
})
export class ViewPayscaleComponent implements OnInit {
  data = employeeData;
  constructor() {}

  ngOnInit(): void {}
}
