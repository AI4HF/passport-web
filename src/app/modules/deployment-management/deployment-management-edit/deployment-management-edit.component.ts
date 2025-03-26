import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../shared/components/base.component";

/**
 * A controller to edit the details of a Model Deployment object
 */
@Component({
  selector: 'app-deployment-management-edit',
  templateUrl: './deployment-management-edit.component.html',
  styleUrl: './deployment-management-edit.component.scss'
})
export class DeploymentManagementEditComponent extends BaseComponent implements OnInit {
  /**
   * The steps of a model deployment
   */
  modelDeploymentSteps: any[];

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {

    this.translateService.get(['DeploymentManagement.Environment Details', 'DeploymentManagement.Model Deployment Details']).subscribe(translations => {
      this.modelDeploymentSteps = [
        {name: translations['DeploymentManagement.Environment Details'], routerLink: 'environment-details'},
        {name: translations['DeploymentManagement.Model Deployment Details'], routerLink: 'model-deployment-details'},
      ];
    });
  }
}
