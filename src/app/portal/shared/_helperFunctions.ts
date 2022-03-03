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

export const handleCheckedData = (chk: boolean, source: any) => {
  let selectedItems = [];
  source.forEach((item) => {
    item.isSelected = chk;
    let data = {
      ...item,
      isSelected: chk,
    };
    if (chk) {
      selectedItems.push(data);

      let uniqList = [...new Set(selectedItems)];
      selectedItems = uniqList;
    } else {
      let index = selectedItems.indexOf(data);
      if (index === -1) {
        selectedItems.splice(index, 1);
      }
    }
  });
  return selectedItems;
};
