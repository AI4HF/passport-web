import {Component, Injector, OnInit} from '@angular/core';
import {takeUntil} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BaseComponent} from "../../../../shared/components/base.component";
import {DeploymentEnvironment} from "../../../../shared/models/deploymentEnvironment.model";
import {DeploymentManagementRoutingModule} from "../../deployment-management-routing.module";

/**
 * Shows details of a deployment environment related to a model deployment
 */
@Component({
  selector: 'app-environment-details',
  templateUrl: './environment-details.component.html',
  styleUrl: './environment-details.component.scss'
})
export class EnvironmentDetailsComponent extends BaseComponent implements OnInit {

    /**
     * The selected deployment environment for the component
     */
    selectedDeploymentEnvironment: DeploymentEnvironment;

    /**
     * The ID of deployment environment created at the environment details form
     */
    environmentIdParam: string;

    /**
     * The form object keeping the deploymentEnvironment information.
     */
    deploymentEnvironmentForm: FormGroup;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.route.parent?.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
            this.environmentIdParam = params['id'];
        });

        this.route.parent.data.pipe(takeUntil(this.destroy$)).subscribe({
            next: data => {
                // checking if environment is already created
                if (this.environmentIdParam === 'new') {
                    this.selectedDeploymentEnvironment = new DeploymentEnvironment({});
                    this.initializeForm();
                } else {
                    this.deploymentEnvironmentService.getDeploymentEnvironmentById(this.environmentIdParam, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: deploymentEnvironment => {
                                this.selectedDeploymentEnvironment = deploymentEnvironment;
                                this.initializeForm();
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
     * Initializes the form object for the given deploymentEnvironment.
     */
    initializeForm() {
        this.deploymentEnvironmentForm = new FormGroup({
            title: new FormControl(this.selectedDeploymentEnvironment.title, Validators.required),
            description: new FormControl(this.selectedDeploymentEnvironment.description, Validators.required),
            hardwareProperties: new FormControl(this.selectedDeploymentEnvironment.hardwareProperties, Validators.required),
            softwareProperties: new FormControl(this.selectedDeploymentEnvironment.softwareProperties, Validators.required),
            connectivityDetails: new FormControl(this.selectedDeploymentEnvironment.connectivityDetails, Validators.required)
        });
    }

    /**
     * Back to deployment management menu
     */
    back(){
        this.router.navigate([`/${DeploymentManagementRoutingModule.route}`]);
    }

    /**
     * Save deploymentEnvironment details
     */
    save() {
        if (this.deploymentEnvironmentForm.invalid) return;
        if (this.environmentIdParam === 'new') {
            const pendingEnvironmentData = { ...this.deploymentEnvironmentForm.value };

            this.router.navigate(['../model-deployment-details'], {
                relativeTo: this.route,
                state: { pendingEnvironmentData: pendingEnvironmentData }
            });
        }else{
            const updatedDeploymentEnvironment: DeploymentEnvironment = {environmentId: this.selectedDeploymentEnvironment.environmentId, ...this.deploymentEnvironmentForm.value};
            this.deploymentEnvironmentService.updateDeploymentEnvironment(updatedDeploymentEnvironment, this.activeStudyService.getActiveStudy())
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (deploymentEnvironment: DeploymentEnvironment) => {
                        this.selectedDeploymentEnvironment = deploymentEnvironment;
                        this.initializeForm();
                        this.translateService.get(['Success', 'DeploymentManagement.Environment.Deployment Environment is updated successfully']).subscribe(translations => {
                            this.messageService.add({
                                severity: 'success',
                                summary: translations['Success'],
                                detail: translations['DeploymentManagement.Environment.Deployment Environment is updated successfully']
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
