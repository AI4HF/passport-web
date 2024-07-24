import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../shared/components/base.component";
import {takeUntil} from "rxjs";
import {ModelDto} from "../../../shared/models/modelDto.model";

/**
 * Component to display and manage a list of passports.
 */
@Component({
  selector: 'app-passport-management-table',
  templateUrl: './passport-management-table.component.html',
  styleUrl: './passport-management-table.component.scss'
})
export class PassportManagementTableComponent extends BaseComponent implements OnInit{
  /** List of modelDtos */
  modelDtoList: ModelDto[];
  /** Columns to be displayed in the table */
  columns: any[];
  /** Loading state of the table */
  loading: boolean = true;
  /** Determines if the form is displayed */
  displayForm: boolean = false;

  /**
   * Constructor to inject dependencies.
   * @param injector The dependency injector
   */
  constructor(protected injector: Injector) {
    super(injector);
    this.columns = [
      { header: 'Passport ID', field: 'passportId' },
      { header: 'Model', field: 'modelName' }
    ];
  }

  /**
   * Initializes the component.
   */
  ngOnInit() {
    this.loadModelsInPassports();
  }

  /**
   * Loads the list of models in passports.
   */
  loadModelsInPassports() {
    this.modelService.getModelListInPassports().pipe(takeUntil(this.destroy$))
        .subscribe({
          next: modelDtoList => {
            this.modelDtoList = modelDtoList.map(modelDto => new ModelDto(modelDto));
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
            this.modelDtoList = this.modelDtoList.filter(modelDto => modelDto.id !== passportId);
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
    //this.selectedPassportId = null;
    this.displayForm = false;
    this.loadModelsInPassports();
  }
}