import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() _tblHeader: any;
  @Input() _data: any;
  @Input() _identifier;
  constructor() {}

  ngOnInit(): void {}
}
