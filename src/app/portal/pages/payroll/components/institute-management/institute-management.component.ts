import { Component, OnInit } from '@angular/core';
import { iManagement } from 'src/assets/raw_data';
@Component({
  selector: 'app-institute-management',
  templateUrl: './institute-management.component.html',
  styleUrls: ['./institute-management.component.scss'],
})
export class InstituteManagementComponent implements OnInit {
  data = iManagement;
  constructor() {}

  ngOnInit(): void {}
}
