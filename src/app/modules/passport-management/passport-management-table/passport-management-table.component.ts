import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../shared/components/base.component";
import { forkJoin, of, switchMap, takeUntil } from "rxjs";
import { ModelWithName } from "../../../shared/models/modelWithName.model";
import { PassportWithModelName } from "../../../shared/models/passportWithModelName.model";
import {ModelDeployment} from "../../../shared/models/modelDeployment.model";
import {DeploymentEnvironment} from "../../../shared/models/deploymentEnvironment.model";
import {Model} from "../../../shared/models/model.model";
import {Study} from "../../../shared/models/study.model";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {Parameter} from "../../../shared/models/parameter.model";
import {Population} from "../../../shared/models/population.model";
import {Experiment} from "../../../shared/models/experiment.model";
import {Survey} from "../../../shared/models/survey.model";

/**
 * Component to display and manage a list of passports.
 */
@Component({
  selector: 'app-passport-management-table',
  templateUrl: './passport-management-table.component.html',
  styleUrl: './passport-management-table.component.scss'
})
export class PassportManagementTableComponent extends BaseComponent implements OnInit {
  /** Columns to be displayed in the table */
  columns: any[];
  /** Loading state of the table */
  loading: boolean = true;
  /** Determines if the form is displayed */
  displayForm: boolean = false;
  /** All passports with model names included */
  passportWithModelNameList: PassportWithModelName[] = [];
  /** All models */
  modelList: ModelWithName[] = [];

  /**
   * Passport content to be served during export.
   */
  selectedPassportId: number | null = null;
  deploymentDetails: ModelDeployment | null = null;
  environmentDetails: DeploymentEnvironment | null = null;
  modelDetails: Model | null = null;
  studyDetails: Study | null = null;
  parameters: Parameter[] | [] = [];
  populationDetails: Population | null = null;
  experiments: Experiment[] | [] = [];
  surveys: Survey[] | [] = [];

  /**
   * Boolean passport preview visibility trigger.
    */
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
   * Initializes the component.
   */
  ngOnInit() {
    if(this.activeStudyService.getActiveStudy()){
      this.loadPassports(this.activeStudyService.getActiveStudy().id);
    }
  }

  /**
   * Loads passports and models data.
   */
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

  /**
   * Maps models to passports to show the model name for each passport.
   */
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

  /**
   * Filters the table based on the input event.
   * @param table The table to be filtered
   * @param event The input event
   */
  filter(table: any, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  /**
   * Shows the form for creating a new passport.
   */
  createPassport() {
    this.displayForm = true;
  }

  /**
   * Deletes the selected passport.
   * @param passportId The ID of the Passport to be deleted
   */
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

  /**
   * Handles the event when the form is closed.
   */
  onFormClosed() {
    this.displayForm = false;
    this.loadPassports(this.activeStudyService.getActiveStudy().id);
  }

  /**
   * Handles the content generation for the Passport.
   * @param passportId Selected Passport's id.
   */
  selectPassportForImport(passportId: number) {
    this.openPdfPreview();
    this.selectedPassportId = passportId;

    this.passportService.getPassportById(passportId).pipe(
        switchMap(passport => this.modelDeploymentService.getModelDeploymentById(passport.deploymentId)),
        switchMap(deployment => {
          this.deploymentDetails = deployment;
          return forkJoin([
            this.deploymentEnvironmentService.getDeploymentEnvironmentById(deployment.environmentId),
            this.modelService.getModelById(deployment.modelId),
          ]);
        }),
        switchMap(([environment, model]) => {
          this.environmentDetails = environment;
          this.modelDetails = model;
          return forkJoin([
            this.studyService.getStudyById(model.studyId),
            this.parameterService.getAllParametersByStudyId(model.studyId),
            this.populationService.getPopulationByStudyId(model.studyId),
            this.surveyService.getSurveysByStudyId(model.studyId),
            this.experimentService.getExperimentListByStudyId(model.studyId)
          ]);
        }),
        takeUntil(this.destroy$)
    ).subscribe({
      next: ([study, parameters, population, surveys, experiments]) => {
        this.studyDetails = study;
        this.parameters = parameters.sort((a, b) => b.parameterId - a.parameterId).slice(0, 5);
        this.populationDetails = population;
        this.surveys = surveys.sort((a, b) => b.surveyId - a.surveyId).slice(0, 5);
        this.experiments = experiments.sort((a, b) => b.experimentId - a.experimentId).slice(0, 5);
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

  /**
   * Handles the pdf generation from the existing data.
   */
  generatePdf() {
    const dataElement = document.getElementById('pdfPreviewContainer');
    if (dataElement) {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      html2canvas(dataElement, {
        scrollY: -window.scrollY,
        scale: 2,
        windowWidth: dataElement.scrollWidth,
        windowHeight: dataElement.scrollHeight
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        pdf.save('DeploymentDetails.pdf');

        this.closePdfPreview();
      }).catch(error => {
        console.error('Error generating PDF:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: this.translateService.instant('PassportManagement.PDF generation failed')
        });
      });
    }
  }

  /**
   * Boolean trigger for opening pdf preview screen.
   */
  openPdfPreview() {
    this.showPdfPreview = true;
  }

  /**
   * Boolean trigger for closing pdf previewscreen.
   */
  closePdfPreview() {
    this.showPdfPreview = false;
  }
}
