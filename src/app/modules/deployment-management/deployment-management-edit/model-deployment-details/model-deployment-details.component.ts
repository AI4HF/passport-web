import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../../shared/components/base.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {takeUntil} from "rxjs";
import {ModelDeployment} from "../../../../shared/models/modelDeployment.model";
import {Model} from "../../../../shared/models/model.model";

/**
 * Shows details of a model deployment
 */
@Component({
  selector: 'app-model-deployment-details',
  templateUrl: './model-deployment-details.component.html',
  styleUrl: './model-deployment-details.component.scss'
})
export class ModelDeploymentDetailsComponent extends BaseComponent implements OnInit{

  /**
   * The selected model deployment for the component
   */
  selectedModelDeployment: ModelDeployment;

  /**
   * The ID of deployment environment created at the environment details form
   */
  environmentIdParam: string;

  /**
   * All model options displayed at the dropdown menu
   */
  modelList: Model[];

  /**
   * The form object keeping the model deployment information.
   */
  modelDeploymentForm: FormGroup;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.route.parent.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.environmentIdParam = params.get('id');
    });

    this.loadModelDeployment(this.environmentIdParam);
    this.fetchModels();
  }

  /**
   * Loads the Deployment details by environment id if entity is being edited.
   */
  loadModelDeployment(id: string) {
    this.modelDeploymentService.getModelDeploymentByEnvironmentId(id, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$)).subscribe({
      next: modelDeployment => {
        this.selectedModelDeployment = modelDeployment;
        this.initializeForm();
      },
      error: error => {
        if (error.status === 404) {
          this.selectedModelDeployment = new ModelDeployment({deploymentId: null});
        } else {
          this.translateService.get('Error').subscribe(translation => {
            this.messageService.add({
              severity: 'error',
              summary: translation,
              detail: error.message
            });
          });
        }
      }
    });
  }

  /**
   * Fetches the model options from the service.
   */
  fetchModels() {
    this.modelService.getModelsByStudyId(this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$)).subscribe({
      next: models => {
        this.modelList = models;
      },
      error: error => {
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
   * Initializes the form object for the given model deployment.
   */
  initializeForm() {
    this.modelDeploymentForm = new FormGroup({
      modelId: new FormControl(this.selectedModelDeployment.modelId, Validators.required),
      tags: new FormControl(this.selectedModelDeployment.tags, Validators.required),
      identifiedFailures: new FormControl(this.selectedModelDeployment.identifiedFailures, Validators.required),
      status: new FormControl(this.selectedModelDeployment.status, Validators.required)
    });
  }

  /**
   * Back to environment details form
   */
  back(){
    this.router.navigate([`../environment-details`], {relativeTo: this.route});
  }

  /**
   * Save model deployment
   */
  save(){
    if(this.selectedModelDeployment.deploymentId === null){
      const newModelDeployment: ModelDeployment = new ModelDeployment(
          { environmentId: this.environmentIdParam,...this.modelDeploymentForm.value});
      this.modelDeploymentService.createModelDeployment(newModelDeployment, this.activeStudyService.getActiveStudy())
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: modelDeployment => {
              this.selectedModelDeployment = modelDeployment;
              this.initializeForm();
              this.translateService.get(['Success', 'DeploymentManagement.Model Deployment is created successfully']).subscribe(translations => {
                this.messageService.add({
                  severity: 'success',
                  summary: translations['Success'],
                  detail: translations['DeploymentManagement.Model Deployment is created successfully']
                });
              });
              this.router.navigate([`../..`], {relativeTo: this.route});
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
    }else{
      const updatedModelDeployment: ModelDeployment = new ModelDeployment(
          {deploymentId: this.selectedModelDeployment.deploymentId, environmentId: this.selectedModelDeployment.environmentId,
             ...this.modelDeploymentForm.value});
      this.modelDeploymentService.updateModelDeployment(updatedModelDeployment, this.activeStudyService.getActiveStudy())
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (modelDeployment: ModelDeployment) => {
              this.selectedModelDeployment = modelDeployment;
              this.initializeForm();
              this.translateService.get(['Success', 'DeploymentManagement.Model Deployment is updated successfully']).subscribe(translations => {
                this.messageService.add({
                  severity: 'success',
                  summary: translations['Success'],
                  detail: translations['DeploymentManagement.Model Deployment is updated successfully']
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
            },
          });
    }
  }
}
