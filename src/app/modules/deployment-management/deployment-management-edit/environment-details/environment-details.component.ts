import {Component, Injector, OnInit} from '@angular/core';
import {takeUntil} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BaseComponent} from "../../../../shared/components/base.component";
import {DeploymentEnvironment} from "../../../../shared/models/deploymentEnvironment.model";
import {DeploymentManagementRoutingModule} from "../../deployment-management-routing.module";

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
     * The form object keeping the deploymentEnvironment information.
     */
    deploymentEnvironmentForm: FormGroup;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.route.parent.data.pipe(takeUntil(this.destroy$)).subscribe({
            next: data => {
                const environmentId = data['deployment'].environmentId;

                // checking if environment is already created
                if (environmentId === undefined) {
                    this.selectedDeploymentEnvironment = new DeploymentEnvironment({});
                    this.initializeForm();
                    return;
                }

                this.deploymentEnvironmentService.getDeploymentEnvironmentById(environmentId).pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: deploymentEnvironment => {
                            this.selectedDeploymentEnvironment = deploymentEnvironment;
                            this.initializeForm();
                        },
                        error: (error: any) => {
                            if(error.status === 404){
                                this.selectedDeploymentEnvironment = new DeploymentEnvironment({});
                                this.initializeForm();
                            }else{
                                this.messageService.add({
                                    severity: 'error',
                                    summary: this.translateService.instant('Error'),
                                    detail: error.message
                                });
                            }
                        }
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
    save(){
        // creating new deployment environment using form inputs
        if(this.selectedDeploymentEnvironment.environmentId === undefined){
            const newDeploymentEnvironment: DeploymentEnvironment = new DeploymentEnvironment({ ...this.deploymentEnvironmentForm.value});
            this.deploymentEnvironmentService.createDeploymentEnvironment(newDeploymentEnvironment)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: deploymentEnvironment => {
                        this.selectedDeploymentEnvironment = deploymentEnvironment;
                        this.initializeForm();this.messageService.add({
                            severity: 'success',
                            summary: this.translateService.instant('Success'),
                            detail: this.translateService.instant('DeploymentManagement.Environment.Deployment Environment is created successfully')
                        });
                        this.router.navigate([`../model-deployment-details`], {relativeTo: this.route, queryParams: { environmentId: this.selectedDeploymentEnvironment.environmentId }});
                    },
                    error: (error: any) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('Error'),
                            detail: error.message
                        });
                    }
                });
        }else{
            const updatedDeploymentEnvironment: DeploymentEnvironment = {environmentId: this.selectedDeploymentEnvironment.environmentId, ...this.deploymentEnvironmentForm.value};
            this.deploymentEnvironmentService.updateDeploymentEnvironment(updatedDeploymentEnvironment)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (deploymentEnvironment: DeploymentEnvironment) => {
                        this.selectedDeploymentEnvironment = deploymentEnvironment;
                        this.initializeForm();
                        this.messageService.add({
                            severity: 'success',
                            summary: this.translateService.instant('Success'),
                            detail: this.translateService.instant('DeploymentManagement.Environment.Deployment Environment is updated successfully')
                        });
                    },
                    error: (error: any) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('Error'),
                            detail: error.message
                        });
                    },
                });
        }
    }

}
