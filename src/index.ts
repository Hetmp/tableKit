import { TableKit } from "./tablekit";
import { TableKitConfig } from "./core/config";
import "./styles/tablekit.css";
// export const version = "__VERSION__";

export default TableKit;

declare global {
  interface JQuery {
    tablekit(config: TableKitConfig): JQuery;
  }
}

(function ($) {
  $.fn.tablekit = function (config: TableKitConfig) {
    this.each(function () {
      const instance = new TableKit(`#${$(this).attr("id")}`, config);
      // @ts-ignore
      $(this).data("tablekit", instance);
    });
    return this;
  };
})(jQuery);
