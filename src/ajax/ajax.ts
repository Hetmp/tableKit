import { TableKitConfig, TableKitAjaxOperation } from "../core/config";
import { TableKitSyncResult } from "../interface/tablekit-sync-result";

export class Crud {
  constructor(private options: TableKitConfig) {}

  public async Save(rowData: any): Promise<TableKitSyncResult> {
    let operation: TableKitAjaxOperation;

    const rowId = rowData[this.options.id || "id"];

    if (typeof this.options.ajax?.create === "string") {
      this.options.ajax.create = { url: this.options.ajax.create };
    }

    if (typeof this.options.ajax?.update === "string") {
      this.options.ajax.update = { url: this.options.ajax.update };
    }

    if (!rowId || rowId === 0 || rowId === "0") {
      operation = this.options.ajax?.create as TableKitAjaxOperation; // new row
    } else {
      operation = this.options.ajax?.update as TableKitAjaxOperation; // existing row
    }

    if (!operation)
      return {
        success: false,
        status: 0,
        errors: [{"key": "config error", "errors": ["No matching ajax operation (create/update) found"]}],
        rowData,
      };

    try {
      const response = await fetch(operation.url, {
        method: operation.method || "POST",
        headers: {
          "Content-Type": "application/json",
          ...(operation.headers || {}),
        },
        body: JSON.stringify(rowData),
      });

      if (!response.ok) {
        return {
          success: false,
          status: response.status,
          errors: [{"key": "server error", "errors": [response.statusText]}],
          rowData,
        };
      }

      const result = await response.json();

      return result;
    } catch (err: any) {
      return {
        success: false,
        status: 0,
        errors: err,
        rowData,
      };
    }
  }
}
