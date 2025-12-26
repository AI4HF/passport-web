import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../shared/components/base.component";
import {Parameter} from "../../../shared/models/parameter.model";
import {takeUntil} from "rxjs/operators";

/**
 * Component to display and manage a list of parameter.
 */
@Component({
  selector: 'app-parameter-management-table',
  templateUrl: './parameter-management-table.component.html',
  styleUrl: './parameter-management-table.component.scss'
})
export class ParameterManagementTableComponent extends BaseComponent implements OnInit{
  /** List of parameters */
  parameterList: Parameter[];
  /** Columns to be displayed in the table */
  columns: any[];
  /** Loading state of the table */
  loading: boolean = true;
  /** Determines if the form is displayed */
  displayForm: boolean = false;
  /** The ID of the selected parameter for editing */
  selectedParameterId: string = null;
  /** Visibility flag for cascade validation dialog */
  displayCascadeDialog: boolean = false;
  /** List of tables to display in the validation dialog */
  cascadeTables: string = '';
  /** Authorization status for the validation dialog */
  cascadeAuthorized: boolean = false;
  /** Temporary storage of the parameter ID pending deletion */
  pendingDeletionId: string = null;

  /**
   * Constructor to inject dependencies.
   * @param injector The dependency injector
   */
  constructor(protected injector: Injector) {
    super(injector);
    this.columns = [
      { header: 'ID', field: 'parameterId' },
      { header: 'Name', field: 'name' },
      { header: 'Data Type', field: 'dataType' },
      { header: 'Description', field: 'description' }
    ];
  }

  /**
   * Initializes the component.
   */
  ngOnInit() {
    const activeStudyId = this.activeStudyService.getActiveStudy();
    if (activeStudyId) {
      this.loadParameters(activeStudyId);
    } else {
      this.translateService.get(['Error', 'ParameterManagement.NoActiveStudy']).subscribe(translations => {
        this.messageService.add({
          severity: 'error',
          summary: translations['Error'],
          detail: translations['ParameterManagement.NoActiveStudy']
        });
      });
      this.loading = false;
    }
  }


  /**
   * Loads the list of parameter by studyId.
   * @param studyId The ID of the study
   */
  loadParameters(studyId: String) {
    this.parameterService.getAllParametersByStudyId(studyId).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: parameters => {
            this.parameterList = parameters.map(parameter => new Parameter(parameter));
          },
          error: (error: any) => {
            this.translateService.get('Error').subscribe(translation => {
              this.messageService.add({
                severity: 'error',
                summary: translation,
                detail: error.message
              });
            });
          },
          complete: () => {
            this.loading = false;
          }
        });
  }

  /**
   * Filters the table based on the input event.
   * @param table The table to be filtered
   * @param event The input event
   */
  filter(table: any, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  /**
   * Shows the form for creating a new parameter.
   */
  createParameter() {
    this.selectedParameterId = null;
    this.displayForm = true;
  }

  /**
   * Shows the form for editing an existing parameter.
   * @param parameter The parameter to be edited
   */
  editParameter(parameter: Parameter) {
    this.selectedParameterId = parameter.parameterId;
    this.displayForm = true;
  }

  /**
   * Initiates the deletion process by validating permissions first.
   * @param parameterId The ID of the Parameter to be deleted
   */
  deleteParameter(parameterId: string) {
    this.pendingDeletionId = parameterId;

    this.parameterService.validateParameterDeletion(parameterId, this.activeStudyService.getActiveStudy())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: string) => {

            if (!response || response.trim() === '') {
              this.executeDeletion(this.pendingDeletionId);
            } else {
              this.cascadeTables = response;
              this.cascadeAuthorized = true;
              this.displayCascadeDialog = true;
            }
          },
          error: (error: any) => {
            if (error.status === 409) {
              this.cascadeTables = error.error || '';
              this.cascadeAuthorized = false;
              this.displayCascadeDialog = true;
            } else {
              this.translateService.get('Error').subscribe(translation => {
                this.messageService.add({
                  severity: 'error',
                  summary: translation,
                  detail: error.message
                });
              });
              this.pendingDeletionId = null;
            }
          }
        });
  }

  /**
   * Executes the actual deletion after validation or confirmation.
   * @param parameterId The ID of the parameter to be deleted
   */
  executeDeletion(parameterId: string) {
    this.parameterService.deleteParameter(parameterId, this.activeStudyService.getActiveStudy())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.parameterList = this.parameterList.filter(parameter => parameter.parameterId !== parameterId);
            this.translateService.get(['Success', 'ParameterManagement.Parameter is deleted successfully']).subscribe(translations => {
              this.messageService.add({
                severity: 'success',
                summary: translations['Success'],
                detail: translations['ParameterManagement.Parameter is deleted successfully']
              });
            });
            this.pendingDeletionId = null;
          },
          error: (error: any) => {
            this.translateService.get('Error').subscribe(translation => {
              this.messageService.add({
                severity: 'error',
                summary: translation,
                detail: error.message
              });
            });
            this.pendingDeletionId = null;
          }
        });
  }

  /**
   * Handles the cancellation of the cascade dialog.
   */
  onCascadeDialogCancel() {
    this.displayCascadeDialog = false;
    this.pendingDeletionId = null;
    this.cascadeTables = '';
  }

  /**
   * Handles the event when the form is closed.
   */
  onFormClosed() {
    this.selectedParameterId = null;
    this.displayForm = false;
    this.loadParameters(this.activeStudyService.getActiveStudy());
  }
}
