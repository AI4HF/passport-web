import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../shared/components/base.component";
import {Model} from "../../../shared/models/model.model";
import {Study} from "../../../shared/models/study.model";
import {takeUntil} from "rxjs/operators";

/**
 * Component to display and manage a list of models.
 */
@Component({
  selector: 'app-model-management-table',
  templateUrl: './model-management-table.component.html',
  styleUrl: './model-management-table.component.scss'
})
export class ModelManagementTableComponent extends BaseComponent implements OnInit {
  /** List of models */
  modelList: Model[];
  /** Columns to be displayed in the table */
  columns: any[];
  /** Loading state of the table */
  loading: boolean = true;
  /** List of studies */
  studies: Study[] = [];
  /** Determines if the form is displayed */
  displayForm: boolean = false;
  /** The ID of the selected study */
  selectedStudyId: number = null;
  /** The ID of the selected model for editing */
  selectedModelId: number = null;
  /**
   * Constructor to inject dependencies.
   * @param injector The dependency injector
   */
  constructor(protected injector: Injector) {
    super(injector);
    this.columns = [
      { header: 'ID', field: 'modelId' },
      { header: 'Name', field: 'name' },
      { header: 'Version', field: 'version' },
      { header: 'Tag', field: 'tag' },
        { header: 'Model Type', field: 'modelType' }
    ];
  }

  /**
   * Initializes the component.
   */
  ngOnInit() {
    this.studyPersonnelService.getStudiesByPersonnelId().pipe(takeUntil(this.destroy$))
        .subscribe({
          next: studies => {
            this.studies = studies.map(study => new Study(study));
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Error'),
              detail: error.message
            });
            this.loading = false;
          }
        });
  }

  /**
   * Loads the list of models by studyId.
   * @param studyId ID of the study
   */
  loadModelsByStudyId(studyId: number) {
    this.selectedStudyId = studyId;
    this.modelService.getModelsByStudyId(studyId).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: models => {
            this.modelList = models.map(model => new Model(model));
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Error'),
              detail: error.message
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
   * Shows the form for creating a new model.
   */
  createModel() {
    this.selectedModelId = null;
    this.displayForm = true;
  }

  /**
   * Shows the form for editing an existing model.
   * @param model The model to be edited
   */
  editModel(model: Model) {
    this.selectedModelId = model.modelId;
    this.displayForm = true;
  }

  /**
   * Deletes the selected model.
   * @param modelId The ID of the model to be deleted
   */
  deleteModel(modelId: number) {
    this.modelService.deleteModel(modelId).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.modelList = this.modelList.filter(model => model.modelId !== modelId);
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('Success'),
              detail: this.translateService.instant('ModelManagement.Model is deleted successfully')
            });
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Error'),
              detail: error.message
            });
          }
        });
  }

  /**
   * Handles the event when the form is closed.
   */
  onFormClosed() {
    this.selectedModelId = null;
    this.displayForm = false;
    this.loadModelsByStudyId(this.selectedStudyId);
  }

}
