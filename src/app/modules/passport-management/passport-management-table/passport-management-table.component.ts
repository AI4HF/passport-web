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

  selectedPassportId: number | null = null;
  deploymentDetails: ModelDeployment | null = null;
  environmentDetails: DeploymentEnvironment | null = null;
  modelDetails: Model | null = null;
  studyDetails: Study | null = null;

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
    this.loadPassports();
  }

  /**
   * Loads passports and models data.
   */
  loadPassports() {
    forkJoin([
      this.passportService.getPassportList().pipe(takeUntil(this.destroy$)),
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
              detail: this.translateService.instant('PassportManagement.Passport is deleted successfully')
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
    this.loadPassports();
  }
  selectPassportForImport(passportId: number) {
    this.openPdfPreview();
    this.selectedPassportId = passportId;

    // Retrieve deployment details based on passport's deploymentId
    this.passportService.getPassportById(passportId).pipe(
        switchMap(passport => this.modelDeploymentService.getModelDeploymentById(passport.deploymentId)),
        switchMap(deployment => {
          this.deploymentDetails = deployment;
          return forkJoin([
            this.deploymentEnvironmentService.getDeploymentEnvironmentById(deployment.environmentId),
            this.modelService.getModelById(deployment.modelId)
          ]);
        }),
        switchMap(([environment, model]) => {
          this.environmentDetails = environment;
          this.modelDetails = model;
          return this.studyService.getStudyById(model.studyId);
        }),
        takeUntil(this.destroy$)
    ).subscribe({
      next: (study) => {
        this.studyDetails = study;
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
  generatePdf() {
    const dataElement = document.getElementById('pdfPreviewContainer');
    if (dataElement) {
      // Ensure the element is visible
      html2canvas(dataElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('DeploymentDetails.pdf');

        // Hide the modal after exporting
        this.closePdfPreview();
      });
    }
  }

  openPdfPreview() {
    this.showPdfPreview = true; // Open the modal
  }

  closePdfPreview() {
    this.showPdfPreview = false; // Close the modal
  }


}
