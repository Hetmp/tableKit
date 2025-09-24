import "datatables.net";
import "jquery.validation";
import { TableKitColumnConfig, TableKitConfig } from "../../core/config";
import { Crud } from "../../ajax/ajax";
import { TableKitValidation } from "../validation";
import { createLoadingDots } from "../../core/helper";

export class MarkCellEditable {
  private colConfig: TableKitColumnConfig[];

  private $table: JQuery<HTMLElement>;

  private table!: DataTables.Api;

  private clickHandler: (event: JQuery.ClickEvent) => void;

  constructor(private selector: string, private config: TableKitConfig) {
    this.colConfig = config.columns;

    this.$table = $(selector);

    this.clickHandler = this.click.bind(this);

    this.init();
  }

  init() {
    this.table = $(this.selector).DataTable();
    // listen for click on table body cells

    if (this.config.editable !== false) {
      this.$table.on("click", `tbody td`, (e) => {
        this.clickHandler(e);
      });
    }
  }

  private click(e: JQuery.TriggeredEvent) {
    const cell = this.table.cell(e.currentTarget);

    const row = this.table.row($(e.currentTarget).closest("tr"));

    const colIdx = cell.index().column;

    //const colName = this.table.column(colIdx).header()?.textContent?.trim();

    const colName = this.table.settings()[0].aoColumns[colIdx].mData as string;

    // check if column is editable
    const colConfig = this.colConfig.find(
      (c) => c.name.toLowerCase() === colName.toLowerCase()
    );

    if (!colConfig) return;

    colConfig.editable && this.makeEditable(row, cell, colConfig);
  }

  private makeEditable(
    row: any,
    cell: DataTables.CellMethods,
    colConfig: TableKitColumnConfig
  ) {
    const originalValue = cell.data();

    const td = $(cell.node());

    // prevent multiple editors
    if (td.find("input").length > 0) return;

    // generate template
    const inputHtml =
      (colConfig.template && this.getTemplate(colConfig.template)) ||
      this.createInputElement(originalValue as string);

    // validation
    const tblkit_vltn = new TableKitValidation();

    const $frm = tblkit_vltn.formWrapper(inputHtml);

    $frm.on("submit", (e) => {
      e.preventDefault();
      return false;
    });

    this.config.validation === "unobtrusive" && tblkit_vltn.parse();

    td.html(""); // clear cell

    td.append($frm);

    const $input = td.find("input");

    // set original value in template
    this.setTemplateValue(td.get(0) as HTMLElement, originalValue);

    // focus
    $input.trigger("focus");

    // focus out

    $input.on("focusout", () => {
      td.html($input.val() || "");
    });

    // blur handler
    $input.on("change", () => {
      var isValid = (colConfig.validate && $frm.valid()) || true;

      if (!isValid) {
        td.addClass("tablekit-error");
        return;
      }

      // mark dirty if changed
      if ($input.val() !== originalValue) {
        $(cell.node()).attr("data-dirty", "true");
      }

      const rowData = row.data();

      rowData[colConfig.name] = $input.val();

      td.empty().append(createLoadingDots()); // show loading

      // restore value
      new Crud(this.config).Save(rowData).then((res) => {
        if (res.success) {
          row.data(res.data).draw();
          $(cell.node()).removeAttr("data-dirty");
          $(cell.node()).addClass("tablekit-saved");
        } else {
          rowData[colConfig.name] = originalValue;
          row.data(rowData).draw(); // restore original

          this._showError(
            td.get(0) as HTMLElement,
            res.errors || [],
            originalValue as string
          );
        }
      });
    });
  }

  private getTemplate(template: string | HTMLElement): HTMLElement | null {
    if (typeof template === "string" && template.startsWith("#")) {
      const tmpl = document.getElementById(template.substring(1))?.innerHTML;

      const container = document.createElement("div");

      container.innerHTML = tmpl || "";

      return container;
    }

    return template as HTMLElement;
  }

  private setTemplateValue(template: HTMLElement, value: any) {
    const input = template.querySelector("input, select, textarea") as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;

    if (input) {
      input.value = value;
    }

    return template;
  }

  private createInputElement(value: string): HTMLInputElement {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "tablekit-input form-control";
    input.value = value;
    input.required = true;
    return input;
  }

  private _showError(
    cellElement: HTMLElement,
    errorResponse: {
      key: string;
      errors: string[];
    }[],
    oldValue: string
  ) {
    // Store old value for restoring
    cellElement.dataset.oldValue = oldValue;

    // Replace cell content with error icon
    cellElement.innerHTML = `
    <div class="tablekit-error" title="Click to see errors">!</div>
  `;

    // Attach click handler to show popup
    const errorBtn = cellElement.querySelector(
      ".tablekit-error"
    ) as HTMLElement;
    if (errorBtn) {
      errorBtn.addEventListener("click", () => {
        this._showErrorPopup(errorResponse);

        // Restore old value after showing popup
        cellElement.textContent = oldValue;
      });
    }
  }

  private _showErrorPopup(errors: { key: string; errors: string[] }[]) {
    // Build HTML from error object
    console.log(errors);
    const msgHtml = errors
      .map(
        (err) => `
        <div class="tablekit-error-block">
          <strong>${err.key}</strong>
          <ul>
            ${err.errors.map((e) => `<li>${e}</li>`).join("")}
          </ul>
        </div>
      `
      )
      .join("");

    const popup = document.createElement("div");
    popup.className = "tablekit-popup";
    popup.innerHTML = `
    <div class="tablekit-popup-content">
      <h4>Validation Errors</h4>
      <div>${msgHtml}</div>
      <button id="popupClose">Close</button>
    </div>
  `;
    document.body.appendChild(popup);

    popup.querySelector("#popupClose")?.addEventListener("click", () => {
      popup.remove();
    });
  }
}
