export const getFriendlyMap = (data: any) => {
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

export const handleCheckedData = (chk: boolean, empData: any) => {
  let selectedItems = [];
  empData.forEach((item) => {
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
