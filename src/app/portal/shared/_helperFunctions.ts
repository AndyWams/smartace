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
        'institution Name',
        'institution Category',
        'account Name',
        'account Number',
        'bank',
        'created On',
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
    case (identifier = _types.SETTINGS):
      return (column = ['name', 'pencom No', 'pfa']);
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
      'employee Name',
      'employee No',
      'department Name ',
      'bank Name',
      'account Number',
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

export const formatEmum = (enumElement: any) => {
  let enumKeys = Object.keys(enumElement).filter((f) => !isNaN(Number(f)));
  return enumKeys.map((x) => parseInt(x));
};

export const commaFormatted = (event: any) => {
  if (event.which >= 37 && event.which <= 40) return;

  if (event.target.value) {
    event.target.value = event.target.value
      .replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};

export const numberCheck = (args: any) => {
  if (args.key === 'e' || args.key === '+' || args.key === '-') {
    return false;
  } else {
    return true;
  }
};

export const getFrequencyValue = (frequency: number) => {
  let val: string = '';
  switch (frequency) {
    case (frequency = 1):
      return (val = 'Daily');
    case (frequency = 2):
      return (val = 'Weekly');
    case (frequency = 3):
      return (val = 'Monthly');
    case (frequency = 4):
      return (val = 'BiAnnually');
    case (frequency = 5):
      return (val = 'Annually');
    default:
      return frequency;
  }
};
export const getStatusValue = (status: number) => {
  let val: string = '';
  switch (status) {
    case (status = 1):
      return (val = 'Approved');
    case (status = 2):
      return (val = 'Pending');
    case (status = 3):
      return (val = 'Rejected');
    default:
      return status;
  }
};
export const getPaymentChannelValue = (id: number) => {
  let val: string = '';
  switch (id) {
    case (id = 1):
      return (val = 'Master Card');
    case (id = 2):
      return (val = 'Bank Payment');
    default:
      return id;
  }
};
export const getPayTypeValue = (id: number) => {
  let val: string = '';
  switch (id) {
    case (id = 1):
      return (val = 'Monthly');
    case (id = 2):
      return (val = 'Time-Shift');
    default:
      return id;
  }
};
export const getElementTypeValue = (id: number) => {
  let val: string = '';
  switch (id) {
    case (id = 1):
      return (val = 'Earnings');
    case (id = 2):
      return (val = 'Deductions');
    default:
      return id;
  }
};
export const compareObjects = (obj1: any, obj2: any) => {
  if (
    obj1?.payElementName == obj2?.payElementName &&
    obj1?.payElementId == obj2?.payElementId
  )
    return true;
  else return false;
};
export const formatDate = (dt: any) => {
  return dt.split('T')[0];
};
export const printElement = (id: any) => {
  let printHtml = document.getElementById(id).outerHTML;
  let elementPage =
    '<html><head><title></title></head><body>' + printHtml + '</body>';
  document.body.outerHTML = elementPage;
  window.print();
  document.location.reload();
};
