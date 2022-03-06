export const getEmployeeDataMap = (data: any) => {
  let employeeData = [];
  data.map((item: any) => {
    const friendlyDataMap: any = {};
    friendlyDataMap.id = item.id;
    friendlyDataMap.empId = item.empId;
    friendlyDataMap.name = item.name;
    friendlyDataMap.department = item.department;
    friendlyDataMap.dateCreated = item.dateCreated;
    friendlyDataMap.isSelected = false;
    employeeData.push(friendlyDataMap);
  });
  return employeeData;
};

export const getInstitutionDataMap = (data: any) => {
  let institutionData = [];
  data.map((item: any) => {
    const friendlyDataMap: any = {};
    friendlyDataMap.id = item.id;
    friendlyDataMap.name = item.name;
    friendlyDataMap.category = item.category;
    friendlyDataMap.accountName = item.accountName;
    friendlyDataMap.accountNumber = item.accountNumber;
    friendlyDataMap.bank = item.bank;
    friendlyDataMap.createdDate = item.createdDate;
    friendlyDataMap.isSelected = false;
    institutionData.push(friendlyDataMap);
  });
  return institutionData;
};
export const getPayElementsDataMap = (data: any) => {
  let payElementsData = [];
  data.map((item: any) => {
    const friendlyDataMap: any = {};
    friendlyDataMap.id = item.id;
    friendlyDataMap.name = item.name;
    friendlyDataMap.payType = item.payType;
    friendlyDataMap.elementName = item.elementName;
    friendlyDataMap.elementCategory = item.elementCategory;
    friendlyDataMap.elementType = item.elementType;
    friendlyDataMap.amount = item.amount;
    friendlyDataMap.institution = item.institution;
    friendlyDataMap.isSelected = false;
    payElementsData.push(friendlyDataMap);
  });
  return payElementsData;
};
export const getPayScaleDataMap = (data: any) => {
  let payScaleData = [];
  data.map((item: any) => {
    const friendlyDataMap: any = {};
    friendlyDataMap.id = item.id;
    friendlyDataMap.name = item.name;
    friendlyDataMap.payElement = item.payElement;
    friendlyDataMap.payFrequency = item.payFrequency;
    friendlyDataMap.noOfEmployees = item.noOfEmployees;
    friendlyDataMap.isSelected = false;
    payScaleData.push(friendlyDataMap);
  });
  return payScaleData;
};
export const getEmployeePayScalePayrollDataMap = (data: any) => {
  let empPayScalePayrollData = [];
  data.map((item: any) => {
    const friendlyDataMap: any = {};
    friendlyDataMap.id = item.id;
    friendlyDataMap.name = item.name;
    friendlyDataMap.empId = item.empId;
    friendlyDataMap.totalEarning = item.totalEarning;
    friendlyDataMap.totalDeduction = item.totalDeduction;
    friendlyDataMap.netPay = item.netPay;
    friendlyDataMap.hoursWorked = item.hoursWorked;
    friendlyDataMap.isSelected = false;
    empPayScalePayrollData.push(friendlyDataMap);
  });
  return empPayScalePayrollData;
};
export const getEmployeePayscaleData = (data: any) => {
  let empPayscaleData = [];
  data.map((item: any) => {
    const friendlyDataMap: any = {};
    friendlyDataMap.id = item.id;
    friendlyDataMap.name = item.name;
    friendlyDataMap.empId = item.empId;
    friendlyDataMap.dept = item.dept;
    friendlyDataMap.employeeDate = item.employeeDate;
    friendlyDataMap.isSelected = false;
    empPayscaleData.push(friendlyDataMap);
  });
  return empPayscaleData;
};
export const getEmployeeGrossPayrollDataMap = (data: any) => {
  let empGrossPayrollData = [];
  data.map((item: any) => {
    const friendlyDataMap: any = {};
    friendlyDataMap.id = item.id;
    friendlyDataMap.name = item.name;
    friendlyDataMap.grossMothlySalary = item.grossMothlySalary;
    friendlyDataMap.earnings = item.earnings;
    friendlyDataMap.deductions = item.deductions;
    friendlyDataMap.netSalary = item.netSalary;
    friendlyDataMap.prorateDeduction = item.prorateDeduction;
    friendlyDataMap.isSelected = false;
    empGrossPayrollData.push(friendlyDataMap);
  });
  return empGrossPayrollData;
};

export const handleCheckedData = (chk: boolean, source: any) => {
  let selectedItems = [];
  source.forEach((item: any) => {
    item.isSelected = chk;
    let data = {
      ...item,
      isSelected: chk,
    };
    if (chk) {
      selectedItems.push(data);
      let uniqList = selectedItems.filter(
        (v, i, a) => a.findIndex((t) => t.id === v.id) === i
      );

      selectedItems = uniqList;
    } else {
      selectedItems.splice(-1, 1);
    }
  });

  return selectedItems;
};
