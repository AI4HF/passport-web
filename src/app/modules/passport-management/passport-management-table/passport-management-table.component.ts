import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../shared/components/base.component";
import { forkJoin, of, switchMap, takeUntil } from "rxjs";
import { ModelWithName } from "../../../shared/models/modelWithName.model";
import { PassportWithModelName } from "../../../shared/models/passportWithModelName.model";
import { ModelDeployment } from "../../../shared/models/modelDeployment.model";
import { DeploymentEnvironment } from "../../../shared/models/deploymentEnvironment.model";
import { Model } from "../../../shared/models/model.model";
import { Study } from "../../../shared/models/study.model";
import { Parameter } from "../../../shared/models/parameter.model";
import { Population } from "../../../shared/models/population.model";
import { Experiment } from "../../../shared/models/experiment.model";
import { Survey } from "../../../shared/models/survey.model";
import { PassportDetailsDTO } from "../../../shared/models/passportDetails.model";
import { LearningProcessWithStagesDTO } from "../../../shared/models/learningProcessWithStagesDTO.model";
import { DatasetWithLearningDatasetsDTO } from "../../../shared/models/datasetWithLearningDatasetsDTO.model";
import { FeatureSetWithFeaturesDTO } from "../../../shared/models/featureSetWithFeaturesDTO.model";
import {EvaluationMeasure} from "../../../shared/models/evaluationMeasure.model";
import {ModelFigure} from "../../../shared/models/modelFigure.model";
import {LinkedArticle} from "../../../shared/models/linkedArticle.model";
import {LearningProcessParameter} from "../../../shared/models/learningProcessParameter.model";
import {LearningStageParameter} from "../../../shared/models/learningStageParameter.model";

/**
 * Component for managing and displaying the list of passports.
 */
@Component({
  selector: 'app-passport-management-table',
  templateUrl: './passport-management-table.component.html',
  styleUrls: ['./passport-management-table.component.scss']
})
export class PassportManagementTableComponent extends BaseComponent implements OnInit {
  /** Columns to be displayed in the passport table */
  columns: any[];
  /** Flag indicating whether data is loading */
  loading: boolean = true;
  /** Flag for displaying the passport creation form */
  displayForm: boolean = false;
  /** List of passports with associated model names */
  passportWithModelNameList: PassportWithModelName[] = [];
  /** List of models */
  modelList: ModelWithName[] = [];

  /** Currently selected passport ID */
  selectedPassportId: string | null = null;
  /** Deployment details for the selected passport */
  deploymentDetails: ModelDeployment | null = null;
  /** Environment details for the selected passport */
  environmentDetails: DeploymentEnvironment | null = null;
  /** Evaluation Measures for the selected passport */
  evaluationMeasures: EvaluationMeasure[]  = [];
  /** Model details for the selected passport */
  modelDetails: Model | null = null;
  /** Study details for the selected passport */
  studyDetails: Study | null = null;
  /** Parameters related to the selected passport */
  parameters: Parameter[] = [];
  /** LearningProcessParameters related to the selected passport */
  learningProcessParameters: LearningProcessParameter[] = [];
  /** LearningStageParameters related to the selected passport */
  learningStageParameters: LearningStageParameter[] = [];
  /** Population details related to the selected passport */
  populationDetails: Population[] = [];
  /** Experiment details related to the selected passport */
  experiments: Experiment[] = [];
  /** Linked Articles related to the selected passport */
  linkedArticles: LinkedArticle[] = [];
  /** Model Figures related to the selected passport */
  modelFigures: ModelFigure[] = [];
  /** Survey details related to the selected passport */
  surveys: Survey[] = [];
  /** Datasets with associated learning datasets for the selected passport */
  datasetsWithLearningDatasets: DatasetWithLearningDatasetsDTO[] = [];
  /** Feature sets with associated features for the selected passport */
  featureSetsWithFeatures: FeatureSetWithFeaturesDTO[] = [];
  /** Learning processes with stages for the selected passport */
  learningProcessesWithStages: LearningProcessWithStagesDTO[] = [];
  signature: Uint8Array = null;

  /** Flag for showing the PDF preview dialog */
  showPdfPreview: boolean = false;

  /**
   * Constructor to inject dependencies.
   * @param injector The dependency injector
   */
  constructor(protected injector: Injector) {
    super(injector);
    this.columns = [
      { header: 'Passport ID', field: 'passport.passportId' },
      { header: 'Model', field: 'modelName' }
    ];
  }

  /**
   * Initializes the component by loading passports for the active study.
   */
  ngOnInit() {
    if (this.activeStudyService.getActiveStudy()) {
      this.loadPassports(this.activeStudyService.getActiveStudy());
    }
  }

  /**
   * Loads the list of passports and associated models for the specified study.
   * @param studyId The ID of the study to load passports for.
   */
  loadPassports(studyId: String) {
    forkJoin([
      this.passportService.getPassportListByStudy(studyId).pipe(takeUntil(this.destroy$)),
      this.modelService.getModelList(this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
    ]).subscribe({
      next: ([passports, models]) => {
        this.passportWithModelNameList = passports.map(passport => new PassportWithModelName(passport, ''));
        this.modelList = models.map(model => new ModelWithName(model));
        this.mapModelsToPassports();
      },
      error: error => {
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
   * Maps model names to passports by linking the model ID to each passport's model.
   */
  mapModelsToPassports() {
    this.passportWithModelNameList.forEach(passportWithModelName => {
      this.modelDeploymentService.getModelDeploymentById(passportWithModelName.passport.deploymentId, this.activeStudyService.getActiveStudy()).pipe(
          switchMap((deployment: ModelDeployment) => {
            passportWithModelName.modelName = (this.modelList.find(m => m.id === deployment.modelId))?.name ?? '';
            return of(passportWithModelName);
          }),
          takeUntil(this.destroy$)
      ).subscribe();
    });
  }

  /**
   * Filters the table globally based on the input event.
   * @param table The table to be filtered.
   * @param event The input event containing the filter value.
   */
  filter(table: any, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  /**
   * Opens the passport creation form.
   */
  createPassport() {
    this.displayForm = true;
  }

  /**
   * Deletes the selected passport by its ID.
   * @param passportId The ID of the passport to delete.
   */
  deletePassport(passportId: string) {
    this.passportService.deletePassport(passportId, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.passportWithModelNameList = this.passportWithModelNameList.filter(passport => passport.passport.passportId !== passportId);
        this.translateService.get(['Success', 'PassportManagement.Deleted']).subscribe(translations => {
          this.messageService.add({
            severity: 'success',
            summary: translations['Success'],
            detail: translations['PassportManagement.Deleted']
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
   * Handles the form closed event by hiding the form and reloading the passports.
   */
  onFormClosed() {
    this.displayForm = false;
    this.loadPassports(this.activeStudyService.getActiveStudy());
  }

  /**
   * Selects a passport for PDF export and loads its details.
   * @param passportId The ID of the passport to select.
   */
  selectPassportForImport(passportId: string) {
    this.selectedPassportId = passportId;

    this.passportService.getPassportDetailsById(passportId, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$)).subscribe({
      next: (passportDetails: PassportDetailsDTO) => {
        const details = passportDetails.detailsJson;

        this.deploymentDetails = details.deploymentDetails;
        this.environmentDetails = details.environmentDetails;
        this.modelDetails = details.modelDetails;
        this.studyDetails = details.studyDetails;
        this.learningProcessParameters = details.learningProcessParameters || [];
        this.learningStageParameters = details.learningStageParameters || [];
        this.parameters = details.parameters?.filter((p: Parameter) => (this.learningStageParameters
            .find(lsp => lsp.parameterId === p.parameterId)) ||
            (this.learningProcessParameters.find(lpp => lpp.parameterId === p.parameterId))) || [];
        this.populationDetails = details.populationDetails || [];
        this.surveys = details.surveys || [];
        this.experiments = details.experiments || [];
        this.linkedArticles = details.linkedArticles || [];
        this.datasetsWithLearningDatasets = details.datasetsWithLearningDatasets || [];
        this.featureSetsWithFeatures = details.featureSetsWithFeatures || [];
        this.learningProcessesWithStages = details.learningProcessesWithStages || [];
        this.evaluationMeasures = details.evaluationMeasures || [];
        this.modelFigures = details.modelFigures || [];
      },
      error: error => {
        this.translateService.get('Error').subscribe(translation => {
          this.messageService.add({
            severity: 'error',
            summary: translation,
            detail: error.message
          });
        });
      },
      complete: () => {
        this.openPdfPreview();
      }
    });
  }

  /**
   * Opens the PDF preview dialog.
   */
  openPdfPreview() {
    this.showPdfPreview = true;
  }

  /**
   * Closes the PDF preview dialog.
   */
  closePdfPreview() {
    this.showPdfPreview = false;
  }

  viewAuditLogs(passportId: string): void {
    this.router.navigate(['/passport-management/audit-logs', passportId]);
  }

}
