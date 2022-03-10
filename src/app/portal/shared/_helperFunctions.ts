import * as _types from '../shared';

export const getTableColumn = (identifier: string, optional?: string) => {
  let column: string[] = [];
  switch (identifier) {
    case (identifier = _types.PAYSCALE):
      return (column = [
        'name',
        'pay Element',
        'pay Frequency',
        'no Of Employees',
      ]);
    case (identifier = _types.INSTITUTION):
      return (column = [
        'name',
        'category',
        'account Name',
        'account Number',
        'bank',
        'date Created',
      ]);
    case (identifier = _types.PAYELEMENTS):
      return (column = [
        'name',
        'pay Type',
        'element Name',
        'element Category',
        'element Type',
        'amount',
        'institution',
      ]);
    case (identifier = _types.EMPLOYEES):
      return (column = ['name', 'emp Id', 'department', 'employment date']);
    case (identifier = _types.EMPLOYEESONPAYSCALE):
      return (column = ['name', 'emp Id', 'department', 'employment date']);
    case (identifier = _types.EMPLOYEESONPAYSCALEPAYROLL):
      return (column = [
        'name',
        'emp Id',
        'total Earning',
        'total Deduction',
        'net Pay',
        'hours Worked',
      ]);
    case (identifier = _types.EMPLOYEESONGROSSPAYROLL):
      return (column = [
        'name',
        'gross Mothly Salary',
        'earnings',
        'deductions',
        'net Salary',
        'prorate Deduction',
      ]);
    case (identifier = _types.PAYROLLRUNLOG):
      return (column = [
        'name',
        'ref No',
        'period',
        'date Approved',
        'approved By',
        'status',
      ]);
    case (identifier = _types.PAYSCHEDULE):
      return (column = ['name', 'pay frequency', 'pay date']);
    case (identifier = _types.PAYSLIPANALYSIS):
      return (column = ['name', 'emp Id', 'earnings', 'deductions', 'net Pay']);
    case (identifier = _types.TAXTYPE):
      return (column = ['tax Name', 'tax Percentage', 'date Created']);
    case (identifier = _types.GROSS):
      return (column = [
        'name',
        'gross Id',
        'department',
        'monthly Earning',
        'monthly Deduction',
        'net Pay',
      ]);
    case (identifier = _types.REPORT):
      return (column = getReportType(optional));

    default:
      return column;
  }
};

export const getReportType = (reportType: string) => {
  let result: string[] = [];
  let someReports = {
    'Bank Schedule Report': [
      'name',
      'scId',
      'department',
      'bank',
      'account No',
      'earnings',
      'deductions',
      'net Pay',
    ],
    'Earning Report': [
      'name',
      'scId',
      'department',
      'location',
      'leave',
      'bonus',
      'others',
    ],
    'Deduction Report': [
      'name',
      'scId',
      'department',
      'location',
      'cooperative',
      'loan',
      'others',
    ],
    'All Element Sheet Report': [
      'name',
      'scId',
      'department',
      'location',
      'cooperative',
      'loan',
      'leave',
    ],
    'Payment Summary Report': ['element Name', 'amount', 'location'],
    'Deduction Summary Report': ['element Name', 'amount', 'location'],
    'Tax Details Report': [
      'name',
      'scId',
      'tax Id',
      'element Name',
      'amount',
      'location',
    ],
    'Pension Details Report': [
      'name',
      'scId',
      'pfa Code',
      'pfa Name',
      'pension Pin',
      'period Name',
      'employee Contribution',
      'employer Contribution',
      'remittance',
    ],
    'Payslip Analysis Report': [
      'name',
      'employee Id',
      'total Current Earning',
      'total Previous Earning',
      'percentage Earning Diff',
      'total Current Deduction',
    ],
  };

  if (someReports.hasOwnProperty(reportType)) {
    result = someReports[reportType];
  }
  return result;
};
