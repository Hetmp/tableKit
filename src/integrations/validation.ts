import "jquery";
import "jquery.validation";

export class TableKitValidation {
  private _form: JQuery<HTMLFormElement>;

  constructor() {
    this._form = $("<form>");
  }

  public validateForm(): boolean {
    return this._form.validate().form();
  }

  public validateSingleField($input: JQuery<HTMLInputElement>): boolean {
    return this._form.validate().element($input);
  }

  public parse(): void {
    ($.validator as any).unobtrusive.parse(this._form.get(0));
  }

  public formWrapper(input: HTMLElement): JQuery<HTMLFormElement> {
    this._form = this._hasAnyForm(input);

    return this._wrapInForm(input, this._form);
  }

  private _hasAnyForm(input: HTMLElement): JQuery<HTMLFormElement> {
    return $(input).closest("form");
  }

  private _wrapInForm(
    input: HTMLElement,
    form: JQuery<HTMLFormElement>
  ): JQuery<HTMLFormElement> {
    // Create a hidden dummy form if needed
    this._form = (form.length > 0 && form) || $("<form>");
    this._form.append(input); // temporarily move field inside
    return this._form;
  }  
}
