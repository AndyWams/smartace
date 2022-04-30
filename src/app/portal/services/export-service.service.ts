import { Injectable } from "@angular/core";
// import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
@Injectable({
  providedIn: "root",
})
export class ExportServiceService {
  constructor() {}

  public exportTableElmToExcel(data: any[], fileName: string): void {
    // inserting first blank row
    const EXCEL_EXTENSION = ".xlsx";
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      data[0].data,
      this.getOptions(data[0])
    );

    for (let i = 1, length = data.length; i < length; i++) {
      // adding a dummy row for separation
      XLSX.utils.sheet_add_json(
        worksheet,
        [{}],
        this.getOptions(
          {
            data: [],
            skipHeader: true,
          },
          -1
        )
      );
      XLSX.utils.sheet_add_json(
        worksheet,
        data[i].data,
        this.getOptions(data[i], -1)
      );
    }
    const workbook: XLSX.WorkBook = {
      Sheets: { Sheet1: worksheet },
      SheetNames: ["Sheet1"],
    };
    // save to file
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }
  /**
   * Creates the XLSX option from the data.
   *
   * @param data data data to create xlsx.
   * @param origin XLSX option origin.
   * @returns options XLSX options.
   */
  private getOptions(data: any, origin?: number): any {
    // adding actual data
    const options = {
      skipHeader: true,
      origin: -1,
      header: [],
    };
    options.skipHeader = data.skipHeader ? data.skipHeader : false;
    if (!options.skipHeader && data.header && data.header.length) {
      options.header = data.header;
    }
    if (origin) {
      options.origin = origin ? origin : -1;
    }
    return options;
  }
}
