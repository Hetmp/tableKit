import { setTableKitGlobalConfig, TableKitConfig } from "./core/config";
import { MarkCellEditable } from "./integrations/jquery/editable-cell";

export class TableKit {
  constructor(private selector: string, private config: TableKitConfig) {
    //check if setup is jquery then call table kit jquery integration
    // if (this.config.provider === 'jquery') {}

    this.init();
  }

  // Attach global config helper as a static method
  static setGlobalConfig = setTableKitGlobalConfig;

  // set version as a static property from package.json
  static version:string = "__VERSION__";

  private init() {
    if (this.config.mode === "cell") {
      new MarkCellEditable(this.selector, this.config);
    }
  }
}
