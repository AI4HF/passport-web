import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../shared/components/base.component";
import {Model} from "../../../shared/models/model.model";
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
  /** Determines if the form is displayed */
  displayForm: boolean = false;
  /** The ID of the selected model for editing */
  selectedModelId: string = null;
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
    if(this.activeStudyService.getActiveStudy()){
      this.loadModelsByStudyId(this.activeStudyService.getActiveStudy());
      this.loading = false;
    }
  }

  /**
   * Loads the list of models by studyId.
   * @param studyId ID of the study
   */
  loadModelsByStudyId(studyId: String) {
    this.modelService.getModelsByStudyId(studyId).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: models => {
            this.modelList = models.map(model => new Model(model));
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
  deleteModel(modelId: string) {
    this.modelService.deleteModel(modelId, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.modelList = this.modelList.filter(model => model.modelId !== modelId);
            this.translateService.get(['Success', 'ModelManagement.Model is deleted successfully']).subscribe(translations => {
              this.messageService.add({
                severity: 'success',
                summary: translations['Success'],
                detail: translations['ModelManagement.Model is deleted successfully']
              });
            });
          },
          error: (error: any) => {
            this.translateService.get('Error').subscribe(translation => {
              this.messageService.add({
                severity: 'error',
                summary: translation,
                detail: error.message
              });
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
    this.loadModelsByStudyId(this.activeStudyService.getActiveStudy());
  }

  /**
   * Navigates to the model parameter assignment table.
   * @param modelId The ID of the selected model
   */
  goToModelParameterAssignment(modelId: string) {
    this.router.navigate([`/model-management/${modelId}/model-parameter-assignment`]);
  }

  /**
   * Navigates to the evaluation measure assignment table.
   * @param modelId The ID of the selected model
   */
  goToEvaluationMeasureAssignment(modelId: string) {
    this.router.navigate([`/model-management/${modelId}/evaluation-measure-assignment`]);
  }

  /**
   * Navigates to the model figure gallery view.
   * @param modelId The ID of the selected model
   */
  goToModelFigureGallery(modelId: string) {
    this.router.navigate([`/model-management/${modelId}/model-figure-gallery`]);
  }

}
