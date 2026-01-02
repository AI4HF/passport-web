import {Component, Injector, OnInit} from '@angular/core';
import {ModelDeployment} from "../../../shared/models/modelDeployment.model";
import {takeUntil} from "rxjs";
import {Table} from "primeng/table";
import {DeploymentManagementRoutingModule} from "../deployment-management-routing.module";
import {BaseComponent} from "../../../shared/components/base.component";


/**
 * Dashboard component for model deployment management.
 */
@Component({
  selector: 'app-deployment-management-dashboard',
  templateUrl: './deployment-management-dashboard.component.html',
  styleUrl: './deployment-management-dashboard.component.scss'
})
export class DeploymentManagementDashboardComponent extends BaseComponent implements OnInit{

  // list of all model deployments
  modelDeploymentList: ModelDeployment[] = [];

  // columns of ModelDeployment to be displayed on a table
  columns: any[];

  // flag indicating objects are being retrieved from the server
  loading: boolean = true;

  /** Visibility flag for cascade validation dialog */
  displayCascadeDialog: boolean = false;

  /** List of tables to display in the validation dialog */
  cascadeTables: string = '';

  /** Authorization status for the validation dialog */
  cascadeAuthorized: boolean = false;

  /** Temporary storage of the deployment ID pending deletion */
  pendingDeletionId: string = null;

  constructor(protected injector: Injector) {
    super(injector);

    // initialize variables
    this.columns = [
      {header: 'ID', field: 'id'},
      {header: 'Tags', field: 'tags'},
      {header: 'Identified Failures', field: 'identifiedFailures'},
      {header: 'Status', field: 'status'}
    ];
  }

  ngOnInit() {
    if(this.activeStudyService.getActiveStudy()){
      this.loadModelDeploymentsByStudyId(this.activeStudyService.getActiveStudy());
    }
  }

  /**
   * Retrieves all model deployments from the server by studyId
   * @param studyId ID of the study
   */
  loadModelDeploymentsByStudyId(studyId: String){
    this.loading = true;
    this.modelDeploymentService.getModelDeploymentListByStudyId(studyId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (modelDeploymentList: ModelDeployment[]) => this.modelDeploymentList = modelDeploymentList,
          error: (error: any) => {
            this.translateService.get('Error').subscribe(translation => {
              this.messageService.add({
                severity: 'error',
                summary: translation,
                detail: error.message
              });
            });
          },
          complete: () => this.loading = false
        });
  }

  /**
   * Filters a table of information based on a given search criteria
   * @param table Table to be filtered
   * @param event Keyboard type event where search text is captured
   */
  filter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  /**
   * Navigate the user to ModelDeployment create page
   */
  createModelDeployment(){
    this.router.navigate([`/${DeploymentManagementRoutingModule.route}/new`]);
  }

  /**
   * Navigate the user to ModelDeployment edit page
   */
  editModelDeployment(id: string){
    this.router.navigate([`/${DeploymentManagementRoutingModule.route}/${id}`]);
  }


  /**
   * Initiates the deletion process by validating permissions first.
   * @param id The ID of the ModelDeployment to be deleted
   */
  deleteModelDeployment(id: string) {
    this.pendingDeletionId = id;
    this.loading = true;

    this.modelDeploymentService.validateModelDeploymentDeletion(id, this.activeStudyService.getActiveStudy())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: string) => {
            this.loading = false;
            if (!response || response.trim() === '') {
              this.executeDeletion(this.pendingDeletionId);
            } else {
              this.cascadeTables = response;
              this.cascadeAuthorized = true;
              this.displayCascadeDialog = true;
            }
          },
          error: (error: any) => {
            this.loading = false;
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
   * @param id The ID of the ModelDeployment to be deleted
   */
  executeDeletion(id: string) {
    this.loading = true;
    this.modelDeploymentService.deleteModelDeployment(id, this.activeStudyService.getActiveStudy())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => {
            this.loadModelDeploymentsByStudyId(this.activeStudyService.getActiveStudy());
            this.translateService.get(['Success', 'DeploymentManagement.Model Deployment is deleted successfully']).subscribe(translations => {
              this.messageService.add({
                severity: 'success',
                summary: translations['Success'],
                detail: translations['DeploymentManagement.Model Deployment is deleted successfully']
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
          },
          complete: () => this.loading = false
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
}