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
import {PassportDetailsDTO} from "../../../shared/models/passportDetails.model";
import {LearningProcessWithStagesDTO} from "../../../shared/models/learningProcessWithStagesDTO.model";
import {DatasetWithLearningDatasetsDTO} from "../../../shared/models/datasetWithLearningDatasetsDTO.model";
import {FeatureSetWithFeaturesDTO} from "../../../shared/models/featureSetWithFeaturesDTO.model";

@Component({
  selector: 'app-passport-management-table',
  templateUrl: './passport-management-table.component.html',
  styleUrls: ['./passport-management-table.component.scss']
})
export class PassportManagementTableComponent extends BaseComponent implements OnInit {
  columns: any[];
  loading: boolean = true;
  displayForm: boolean = false;
  passportWithModelNameList: PassportWithModelName[] = [];
  modelList: ModelWithName[] = [];

  selectedPassportId: number | null = null;
  deploymentDetails: ModelDeployment | null = null;
  environmentDetails: DeploymentEnvironment | null = null;
  modelDetails: Model | null = null;
  studyDetails: Study | null = null;
  parameters: Parameter[] = [];
  populationDetails: Population[] = [];
  experiments: Experiment[] = [];
  surveys: Survey[] = [];
  datasetsWithLearningDatasets: DatasetWithLearningDatasetsDTO[] = [];
  featureSetsWithFeatures: FeatureSetWithFeaturesDTO[] = [];
  learningProcessesWithStages: LearningProcessWithStagesDTO[] = [];

  showPdfPreview: boolean = false;

  constructor(protected injector: Injector) {
    super(injector);
    this.columns = [
      { header: 'Passport ID', field: 'passport.passportId' },
      { header: 'Model', field: 'modelName' }
    ];
  }

  ngOnInit() {
    if(this.activeStudyService.getActiveStudy()){
      this.loadPassports(this.activeStudyService.getActiveStudy().id);
    }
  }

  loadPassports(studyId: number) {
    forkJoin([
      this.passportService.getPassportListByStudy(studyId).pipe(takeUntil(this.destroy$)),
      this.modelService.getModelList().pipe(takeUntil(this.destroy$))
    ]).subscribe({
      next: ([passports, models]) => {
        this.passportWithModelNameList = passports.map(passport => new PassportWithModelName(passport, ''));
        this.modelList = models.map(model => new ModelWithName(model));
        this.mapModelsToPassports();
      },
      error: error => {
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

  mapModelsToPassports() {
    this.passportWithModelNameList.forEach(passportWithModelName => {
      this.modelDeploymentService.getModelDeploymentById(passportWithModelName.passport.deploymentId).pipe(
          switchMap((deployment: ModelDeployment) => {
            passportWithModelName.modelName = (this.modelList.find(m => m.id === deployment.modelId)).name;
            return of(passportWithModelName);
          }),
          takeUntil(this.destroy$)
      ).subscribe();
    });
  }

  filter(table: any, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  createPassport() {
    this.displayForm = true;
  }

  deletePassport(passportId: number) {
    this.passportService.deletePassport(passportId).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.passportWithModelNameList = this.passportWithModelNameList.filter(passport => passport.passport.passportId !== passportId);
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('Success'),
              detail: this.translateService.instant('PassportManagement.Deleted')
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

  onFormClosed() {
    this.displayForm = false;
    this.loadPassports(this.activeStudyService.getActiveStudy().id);
  }

  selectPassportForImport(passportId: number) {
    this.openPdfPreview();
    this.selectedPassportId = passportId;

    this.passportService.getPassportDetailsById(passportId).pipe(
        takeUntil(this.destroy$)
    ).subscribe({
      next: (passportDetails: PassportDetailsDTO) => {
        // Extract details from the JSON object in passportDetails.detailsJson
        const details = passportDetails.detailsJson;

        // Deployment details
        this.deploymentDetails = details.deploymentDetails;
        this.environmentDetails = details.environmentDetails;

        // Model details
        this.modelDetails = details.modelDetails;

        // Study details
        this.studyDetails = details.studyDetails;

        // Parameters
        this.parameters = details.parameters || [];

        // Population details
        this.populationDetails = details.populationDetails || [];

        // Surveys
        this.surveys = details.surveys || [];

        // Experiments
        this.experiments = details.experiments || [];

        // Datasets with Learning Datasets
        this.datasetsWithLearningDatasets = details.datasetsWithLearningDatasets || [];

        // Feature Sets with Features
        this.featureSetsWithFeatures = details.featureSetsWithFeatures || [];

        // Learning Processes with Stages
        this.learningProcessesWithStages = details.learningProcessesWithStages || [];
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: error.message
        });
      }
    });
  }

  openPdfPreview() {
    this.showPdfPreview = true;
  }

  closePdfPreview() {
    this.showPdfPreview = false;
  }
}
