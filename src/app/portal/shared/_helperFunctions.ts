import * as _types from '../shared';

export const getTableColumn = (identifier: string) => {
  let column: string[] = [];
  switch (identifier) {
    case (identifier = _types.PAYSCALE):
      return (column = [
        'name',
        'payElement',
        'payFrequency',
        'noOfEmployees',
        'action',
      ]);
    case (identifier = _types.INSTITUTION):
      return (column = [
        'name',
        'category',
        'accountName',
        'accountNumber',
        'bank',
        'dateCreated',
        'action',
      ]);
    case (identifier = _types.PAYELEMENTS):
      return (column = [
        'name',
        'payType',
        'elementName',
        'elementCategory',
        'elementType',
        'amount',
        'institution',
        'action',
      ]);
    case (identifier = _types.EMPLOYEES):
      return (column = ['name', 'empId', 'department', 'dateCreated']);
    case (identifier = _types.EMPLOYEESONPAYSCALE):
      return (column = [
        'name',
        'empId',
        'department',
        'dateCreated',
        'action',
      ]);
    case (identifier = _types.EMPLOYEESONPAYSCALEPAYROLL):
      return (column = [
        'name',
        'empId',
        'totalEarning',
        'totalDeduction',
        'netPay',
        'hoursWorked',
        'action',
      ]);
    case (identifier = _types.EMPLOYEESONGROSSPAYROLL):
      return (column = [
        'name',
        'grossMothlySalary',
        'earnings',
        'deductions',
        'netSalary',
        'prorateDeduction',
        'action',
      ]);

    default:
      return column;
  }
};
