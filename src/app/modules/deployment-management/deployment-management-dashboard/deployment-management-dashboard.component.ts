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
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Error'),
              detail: error.message
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
   * Delete a ModelDeployment
   */
  deleteModelDeployment(id: string){
    this.loading = true;
    this.modelDeploymentService.deleteModelDeployment(id, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => {
            this.loadModelDeploymentsByStudyId(this.activeStudyService.getActiveStudy());
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('Success'),
              detail: this.translateService.instant('DeploymentManagement.Deployment is deleted successfully')
            });
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Error'),
              detail: error.message
            });
          },
          complete: () => this.loading = false
        });
  }
}