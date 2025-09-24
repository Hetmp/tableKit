export interface TableKitSyncResult {
  success: boolean;
  status: number;
  data?: any;      // server response JSON
  errors?: {
      key: string;
      errors: string[];
    }[];  // error message if failed
  rowData: any;    // the row that was attempted
}
