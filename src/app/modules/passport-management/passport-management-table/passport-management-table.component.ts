import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../shared/components/base.component";
import { forkJoin, of, switchMap, takeUntil } from "rxjs";
import { ModelWithName } from "../../../shared/models/modelWithName.model";
import { PassportWithModelName } from "../../../shared/models/passportWithModelName.model";
import {ModelDeployment} from "../../../shared/models/modelDeployment.model";

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
}
