import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-chart-graph',
  templateUrl: './chart-graph.component.html',
  styleUrls: ['./chart-graph.component.scss'],
})
export class ChartGraphComponent implements OnInit {
  @Input() _chartType;
  filterItem: string;
  public barChartType: ChartType = 'bar';
  public lineChartType: ChartType = 'line';
  public pieChartType: ChartType = 'pie';

  constructor() {}
  public lineChartDatasets: Array<any> = [
    {
      data: [620, 800, 750, 620, 700, 700, 600, 400, 500, 300, 200, 900],
      label: 'Pension',
      tension: 0.4,
    },
    {
      data: [420, 500, 250, 0, 120, 700, 650, 800, 780, 350, 250, 1200],
      label: 'Taxes',
      tension: 0.4,
    },
    {
      data: [120, 300, 350, 49, 520, 450, 330, 400, 680, 650, 350, 1000],
      label: 'Salary',
      tension: 0.4,
    },
    {
      data: [430, 100, 250, 50, 300, 550, 210, 500, 680, 450, 350, 1100],
      label: 'Health',
      tension: 0.4,
    },
  ];
  public barChartDatasets: Array<any> = [
    {
      barThickness: 150,
      data: [50, 150, 200, 250, 100, 300],
    },
  ];
  public pieChartData: Array<any> = ['300', '50', '100'];
  public lineChartLabels: Array<any> = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  public barChartLabels: Array<any> = [
    'Jan',
    'Feb',
    'Jun',
    'Oct',
    'Nov',
    'Dec',
  ];
  public pieChartLabels: Array<any> = ['Net Pay', 'Deductions', 'Earnings'];
  public lineChartColors: Array<any> = [
    {
      backgroundColor: 'white',
      borderColor: '#4847e0',
      borderWidth: 2,
    },
    {
      backgroundColor: 'white',
      borderColor: '#2e9cda',
      borderWidth: 2,
    },
    {
      backgroundColor: 'white',
      borderColor: '#E2D136',
      borderWidth: 2,
    },
    {
      backgroundColor: 'white',
      borderColor: ' #2CD9C5',
      borderWidth: 2,
    },
  ];
  public pieChartColors: Array<any> = [
    {
      hoverBorderColor: [
        'rgba(0, 0, 0, 0.1)',
        'rgba(0, 0, 0, 0.1)',
        'rgba(0, 0, 0, 0.1)',
        'rgba(0, 0, 0, 0.1)',
        'rgba(0, 0, 0, 0.1)',
      ],
      hoverBorderWidth: 0,
      backgroundColor: ['#4847e0', '#e2d136', '#2e9cda'],
      hoverBackgroundColor: ['#4847e0', '#e2d136', '#2e9cda'],
    },
  ];
  public barChartColors: Array<any> = [
    {
      hoverBorderWidth: 0,
      backgroundColor: ['#2D9CDB', '#F2994A', '#27AE60'],
    },
  ];
  public lineChartOptions: any = {
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    scaleShowVerticalLines: false,
    scales: {
      y: {
        grid: {
          beginAtZero: true,
          color: 'transparent',
        },
      },
    },
  };
  public barChartOptions: any = {
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    scaleShowVerticalLines: false,
    scales: {
      y: {
        grid: {
          beginAtZero: true,
          color: 'transparent',
        },
      },
    },
  };
  public pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  ngOnInit(): void {}

  setFilterItem(val: string) {
    val === 'last-month'
      ? (this.filterItem = 'Last Month')
      : val === 'this-year'
      ? (this.filterItem = 'This year')
      : null;
  }
}
