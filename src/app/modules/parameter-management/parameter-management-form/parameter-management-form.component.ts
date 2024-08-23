import {Component, EventEmitter, Injector, Input, OnInit, Output} from '@angular/core';
import {BaseComponent} from "../../../shared/components/base.component";
import {Parameter} from "../../../shared/models/parameter.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {takeUntil} from "rxjs/operators";

/**
 * Component for creating or updating parameter.
 */
@Component({
  selector: 'app-parameter-management-form',
  templateUrl: './parameter-management-form.component.html',
  styleUrl: './parameter-management-form.component.scss'
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
  /**
   * Constructor to inject dependencies.
   * @param injector The dependency injector
   */
  constructor(protected injector: Injector) {
    super(injector);
  }

  /**
   * Initializes the component.
   */
  ngOnInit() {
    this.loadParameter();
  }

  /**
   * Loads the parameter details if a survey ID is provided.
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
      this.selectedParameter = new Parameter({studyId: this.activeStudyService.getActiveStudy().id});
      this.initializeForm();
    }
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
   * Saves the parameter.
   */
  saveParameter() {
    if(!this.selectedParameter.parameterId){
      const newParameter: Parameter = new Parameter({studyId: this.activeStudyService.getActiveStudy().id, ...this.parameterForm.value});
      this.parameterService.createParameter(newParameter)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: parameter => {
              this.selectedParameter = parameter;
              this.initializeForm();
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('Sucess'),
                detail: this.translateService.instant('ParameterManagement.Parameter is created successfully')
              });
            },
            error: (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Error'),
                detail: error.message
              });
            },
            complete: () => {
              this.closeDialog();
            }
          });
    }else{
      const updatedParameter: Parameter = new Parameter({studyId: this.activeStudyService.getActiveStudy().id, parameterId: this.selectedParameter.parameterId, ...this.parameterForm.value});
      this.parameterService.updateParameter(updatedParameter)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (parameter: Parameter) => {
              this.selectedParameter = parameter;
              this.initializeForm();
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('Sucess'),
                detail: this.translateService.instant('ParameterManagement.Parameter is updated successfully')
              });
            },
            error: (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Error'),
                detail: error.message
              });
            },
            complete: () => {
              this.closeDialog();
            }
          });
    }
  }

  /**
   * Closes the dialog
   */
  closeDialog() {
    this.display = false;
    this.formClosed.emit();
  }

}
