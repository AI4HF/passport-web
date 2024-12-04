import {Component, EventEmitter, Injector, Input, OnInit, Output} from '@angular/core';
import { Passport } from "../../../shared/models/passport.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseComponent } from "../../../shared/components/base.component";
import { forkJoin, takeUntil } from "rxjs";
import { ModelWithName } from "../../../shared/models/modelWithName.model";
import { ModelDeploymentWithModelName } from "../../../shared/models/modelDeploymentWithModelName.model";
import {PassportDetailsSelection} from "../../../shared/models/passportDetailsSelection.model";
import {PassportWithDetailSelection} from "../../../shared/models/passportWithDetailSelection.model";

/**
 * Component for creating passport.
 */
@Component({
    selector: 'app-passport-management-form',
    templateUrl: './passport-management-form.component.html',
    styleUrl: './passport-management-form.component.scss'
})
export class PassportManagementFormComponent extends BaseComponent implements OnInit {
    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** Form group for passport form controls */
    passportForm: FormGroup;
    /** flag indicating that dialog is visible */
    display = false;
    /** All deployed model names that will be displayed at the dropdown menu */
    modelDeploymentList: ModelDeploymentWithModelName[];
    /** All model names */
    modelNameList: ModelWithName[];

    /**
     * Constructor to inject dependencies.
     * @param injector The dependency injector
     */
    constructor(protected injector: Injector) {
        super(injector);
    }

    /**
     * Initializes the component.
     */
    ngOnInit() {
        this.loadData();
        this.initializeForm();
    }

    /**
     * Initializes the form group.
     */
    initializeForm() {
        this.passportForm = new FormGroup({
            deploymentId: new FormControl(null, Validators.required),
            modelDetails: new FormControl(true, Validators.required),
            modelDeploymentDetails: new FormControl(true, Validators.required),
            environmentDetails: new FormControl(true, Validators.required),
            datasets: new FormControl(true, Validators.required),
            featureSets: new FormControl(true, Validators.required),
            learningProcessDetails: new FormControl(true, Validators.required),
            parameterDetails: new FormControl(true, Validators.required),
            populationDetails: new FormControl(true, Validators.required),
            experimentDetails: new FormControl(true, Validators.required),
            surveyDetails: new FormControl(true, Validators.required),
            studyDetails: new FormControl(true, Validators.required),
        });
        this.display = true;
    }

    /**
     * Loads models and model deployments data.
     */
    loadData() {
        forkJoin([
            this.modelDeploymentService.getModelDeploymentListByStudyId(+this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$)),
            this.modelService.getModelList(+this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
        ]).subscribe({
            next: ([modelDeployments, models]) => {
                this.modelDeploymentList = modelDeployments.map(modelDeployment => new ModelDeploymentWithModelName(modelDeployment, ''));
                this.modelNameList = models.map(model => new ModelWithName(model));
                this.mapModelsToModelDeployments();
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
     * Maps models to modelDeployments to populate the model name for each model deployment.
     */
    mapModelsToModelDeployments() {
        this.modelDeploymentList.forEach(modelDeploymentWithModelName => {
            modelDeploymentWithModelName.modelName = (this.modelNameList.find(m => m.id === modelDeploymentWithModelName.modelDeployment.modelId)).name;
        });
    }

    /**
     * Saves the passport.
     */
    savePassport() {
        // @ts-ignore
        const newPassport: Passport = new Passport({...this.passportForm.value, studyId: +this.activeStudyService.getActiveStudy()});
        const passportDetails: PassportDetailsSelection = new PassportDetailsSelection({...this.passportForm.value});
        const passportWithDetailSelection: PassportWithDetailSelection = new PassportWithDetailSelection({passport: newPassport, passportDetailsSelection: passportDetails});
        this.passportService.createPassport(passportWithDetailSelection, +this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: passport => {
                    this.initializeForm();
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('PassportManagement.Created')
                    });
                },
                error: (error: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                },
                complete: () => {
                    this.closeDialog();
                }
            });
    }

    /**
     * Closes the dialog
     */
    closeDialog() {
        this.display = false;
        this.formClosed.emit();
    }
}
