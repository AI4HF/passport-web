import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from "../../../shared/components/base.component";
import { Parameter } from "../../../shared/models/parameter.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs/operators";

/**
 * Component for creating or updating parameters.
 */
@Component({
  selector: 'app-parameter-management-form',
  templateUrl: './parameter-management-form.component.html',
  styleUrls: ['./parameter-management-form.component.scss']
})
export class ParameterManagementFormComponent extends BaseComponent implements OnInit {

  /** The ID of the parameter to be edited */
  @Input() parameterId: number;
  /** Event emitted when the form is closed */
  @Output() formClosed = new EventEmitter<void>();

  /** The selected parameter */
  selectedParameter: Parameter;

  /** Form group for parameter form controls */
  parameterForm: FormGroup;

  /** flag indicating that dialog is visible */
  display = false;

  /** List of hardcoded parameters loaded from JSON */
  hardcodedParameters: Parameter[] = [];

  /** Filtered list for auto-fill suggestions */
  filteredParameters: Parameter[] = [];

  /**
   * Constructor to inject dependencies.
   * @param injector The dependency injector
   * @param http The HTTP client for loading JSON
   */
  constructor(protected injector: Injector, private http: HttpClient) {
    super(injector);
  }

  /**
   * Initializes the component.
   */
  ngOnInit() {
    this.loadParameter();
    this.loadHardcodedParameters();
  }

  /**
   * Loads the parameter details if a parameter ID is provided.
   */
  loadParameter() {
    if (this.parameterId) {
      this.parameterService.getParameterById(this.parameterId).pipe(takeUntil(this.destroy$))
          .subscribe({
            next: parameter => {
              this.selectedParameter = new Parameter(parameter);
              this.initializeForm();
            },
            error: (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Error'),
                detail: error.message
              });
            }
          });
    } else {
      this.selectedParameter = new Parameter({});
      this.initializeForm();
    }
  }

  /**
   * Loads the hardcoded parameter list from a JSON file.
   */
  loadHardcodedParameters() {
    this.http.get<Parameter[]>('assets/data/hardcoded-parameters.json').pipe(takeUntil(this.destroy$))
        .subscribe({
          next: data => this.hardcodedParameters = data,
          error: err => console.error('Failed to load hardcoded parameters', err)
        });
  }

  /**
   * Initializes the form group.
   */
  initializeForm() {
    this.parameterForm = new FormGroup({
      name: new FormControl(this.selectedParameter.name, Validators.required),
      dataType: new FormControl(this.selectedParameter.dataType, Validators.required),
      description: new FormControl(this.selectedParameter.description, Validators.required)
    });
    this.display = true;
  }

  /**
   * Filters the hardcoded parameters based on user input.
   */
  filterParameters(event: any) {
    const query = event.query.toLowerCase();
    this.filteredParameters = this.hardcodedParameters.filter(p => p.name.toLowerCase().includes(query));
  }

  /**
   * Auto-fills the form with the selected hardcoded parameter.
   */
  selectAutoFill(event: any) {
    const selectedParameter = event.value;
    this.parameterForm.setValue({
      name: selectedParameter.name,
      dataType: selectedParameter.dataType,
      description: selectedParameter.description
    });
  }

  /**
   * Saves the parameter.
   */
  saveParameter() {
    if (!this.selectedParameter.parameterId) {
      const newParameter: Parameter = new Parameter({ ...this.parameterForm.value });
      this.parameterService.createParameter(newParameter).pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.closeDialog();
          });
    } else {
      const updatedParameter: Parameter = new Parameter({ parameterId: this.selectedParameter.parameterId, ...this.parameterForm.value });
      this.parameterService.updateParameter(updatedParameter).pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.closeDialog();
          });
    }
  }

  /**
   * Closes the dialog.
   */
  closeDialog() {
    this.display = false;
    this.formClosed.emit();
  }
}
