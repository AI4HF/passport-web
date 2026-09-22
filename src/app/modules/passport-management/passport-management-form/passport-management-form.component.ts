import {Component, EventEmitter, Injector, OnInit, Output} from '@angular/core';
import { Passport } from "../../../shared/models/passport.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseComponent } from "../../../shared/components/base.component";
import { takeUntil } from "rxjs";
import { ModelWithName } from "../../../shared/models/modelWithName.model";
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
    /** All model names that will be displayed at the dropdown menu */
    modelNameList: ModelWithName[];

    /**
     * Constructor to inject dependencies.
     * @param injector The dependency injector
     * @param auditLogBookService
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
            modelId: new FormControl(null, Validators.required),
            modelDetails: new FormControl(true, Validators.required),
            qualityCriteria: new FormControl(true, Validators.required),
            qualityAssessments: new FormControl(true, Validators.required),
            datasets: new FormControl(true, Validators.required),
            featureSets: new FormControl(true, Validators.required),
            learningProcessDetails: new FormControl(true, Validators.required),
            parameterDetails: new FormControl(true, Validators.required),
            populationDetails: new FormControl(true, Validators.required),
            experimentDetails: new FormControl(true, Validators.required),
            linkedArticleDetails: new FormControl(true, Validators.required),
            surveyDetails: new FormControl(true, Validators.required),
            studyDetails: new FormControl(true, Validators.required),
            evaluationMeasures: new FormControl(true, Validators.required),
            modelFigures: new FormControl(true, Validators.required),
            excludeEmptyFields: new FormControl(true, Validators.required)
        });
        this.display = true;
    }

    /**
     * Loads the models the passport can be generated for.
     */
    loadData() {
        this.modelService.getModelList(this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$)).subscribe({
            next: (models) => {
                this.modelNameList = models.map(model => new ModelWithName(model));
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
     * Saves the passport.
     */
    savePassport() {
        const newPassport: Passport = new Passport({
            ...this.passportForm.value,
            studyId: this.activeStudyService.getActiveStudy(),
        });
        const passportDetails: PassportDetailsSelection = new PassportDetailsSelection({
            ...this.passportForm.value,
        });
        const passportWithDetailSelection: PassportWithDetailSelection = new PassportWithDetailSelection({
            passport: newPassport,
            passportDetailsSelection: passportDetails,
        });

        this.passportService
            .createPassport(passportWithDetailSelection, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (passport) => {
                    this.auditLogBookService
                        .createAuditLogBookEntries(
                            passport.passportId.toString(),
                            this.activeStudyService.getActiveStudy()
                        )
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: () => {
                                this.translateService.get(['Success', 'AuditLogBook.Created']).subscribe(translations => {
                                    this.messageService.add({
                                        severity: 'success',
                                        summary: translations['Success'],
                                        detail: translations['AuditLogBook.Created']
                                    });
                                });
                            },
                            error: (error) => {
                                this.translateService.get('Error').subscribe(translation => {
                                    this.messageService.add({
                                        severity: 'error',
                                        summary: translation,
                                        detail: error.message
                                    });
                                });
                            },
                            complete: () => {
                                this.closeDialog();
                            }
                        });
                    this.initializeForm();
                    this.translateService.get(['Success', 'PassportManagement.Created']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['PassportManagement.Created']
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
