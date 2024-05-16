import {Component, EventEmitter, Injector, Input, Output, ViewChild} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

/**
 * Component to display an input field. Based on the configurations, it can present the input
 * in one of the following views:
 *  - Label and value in one line i.e. labelOnTop = false
 *    - Label and value css classes can be configured.
 *  - Label and value in two lines i.e. labelOnTop = true
 * You can also bind it to a FormControl and set its input type and placeholder.
 */
@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR, useExisting: FormInputComponent, multi: true
  }]
})
export class FormInputComponent implements ControlValueAccessor {

  @ViewChild(FormControlDirective, {static: true})
  formControlDirective: FormControlDirective;

  @Input()
  formControl: FormControl;

  @Input()
  controlName: string;

  @Input()
  labelOnTop: boolean;

  @Input()
  inputId: string;

  @Input()
  label: string = null;

  @Input()
  placeholder: string = null;

  @Input()
  type: string = 'text';

  // tooltip message for the label
  @Input()
  tooltipMessage: string;

  /**
   * Css classes to be applied to form label
   */
  @Input() labelClass = 'col-2';
  /**
   * Css classes to be applied to form value
   */
  @Input() valueClass = 'col-2';
  // append a `.csv` icon at the end of the input box
  @Input() appendCsvSuffix: boolean = false;
  // event emitter for blur event
  @Output() blurred = new EventEmitter();
  // if the input is the last row in the form, remove the margin bottom
  @Input() lastRow: boolean = false;

  get control() {
    return this.formControl || this.controlContainer.control?.get(this.controlName);
  }

  constructor(private injector: Injector) {
  }

  get controlContainer() {
    return this.injector.get(ControlContainer);
  }

  registerOnTouched(fn: any): void {
    this.formControlDirective.valueAccessor?.registerOnTouched(fn);
  }

  registerOnChange(fn: any): void {
    this.formControlDirective.valueAccessor?.registerOnChange(fn);
  }

  writeValue(obj: any): void {
    this.formControlDirective.valueAccessor?.writeValue(obj);
  }

  setDisabledState(isDisabled: boolean): void {
    this.formControlDirective.valueAccessor?.setDisabledState?.(isDisabled);
  }
}
