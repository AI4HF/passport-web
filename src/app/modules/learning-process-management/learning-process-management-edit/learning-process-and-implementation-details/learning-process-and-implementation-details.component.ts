import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil, forkJoin } from "rxjs";
import { LearningProcess } from "../../../../shared/models/learningProcess.model";
import { Implementation } from "../../../../shared/models/implementation.model";
import { LearningProcessManagementRoutingModule } from "../../learning-process-management-routing.module";
import { Algorithm } from "../../../../shared/models/algorithm.model";

/**
 * Component to display and manage the details of a learning process and its implementation.
 */
@Component({
    selector: 'app-learning-process-and-implementation-details',
    templateUrl: './learning-process-and-implementation-details.component.html',
    styleUrls: ['./learning-process-and-implementation-details.component.scss']
})
export class LearningProcessAndImplementationDetailsComponent extends BaseComponent implements OnInit {

    /** The currently selected learning process */
    selectedLearningProcess: LearningProcess;

    /** The currently selected implementation */
    selectedImplementation: Implementation;

    /** The form group for the learning process and implementation */
    formGroup: FormGroup;

    /** List of algorithms */
    algorithms: Algorithm[] = [];

    /** Flag to indicate if the form is in edit mode */
    isEditMode: boolean = false;

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
        this.route.parent.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            const id = params.get('id');
            if (id !== 'new') {
                this.isEditMode = true;
                this.loadLearningProcess(+id);
            } else {
                this.selectedLearningProcess = new LearningProcess({ id: 0 });
                this.selectedImplementation = new Implementation({ implementationId: 0 });
                this.initializeForm();
            }
        });
        this.loadAlgorithms();
    }

    /**
     * Loads the Learning Process and its Implementation details by id if entity is being edited.
     */
    loadLearningProcess(id: number) {
        this.learningProcessService.getLearningProcessById(id).pipe(takeUntil(this.destroy$)).subscribe({
            next: learningProcess => {
                this.selectedLearningProcess = learningProcess;
                this.loadImplementation(learningProcess.implementationId);
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
     * Loads the Implementation details by id.
     */
    loadImplementation(implementationId: number) {
        this.implementationService.getImplementationById(implementationId).pipe(takeUntil(this.destroy$)).subscribe({
            next: implementation => {
                this.selectedImplementation = implementation;
                this.initializeForm();
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
     * Initializes the form group with the learning process and implementation data.
     */
    initializeForm() {
        this.formGroup = new FormGroup({
            // Implementation Fields
            software: new FormControl(this.selectedImplementation?.software || '', Validators.required),
            name: new FormControl(this.selectedImplementation?.name || '', Validators.required),
            algorithm: new FormControl(this.selectedImplementation?.algorithmId || null, Validators.required),

            // Learning Process Field
            description: new FormControl(this.selectedLearningProcess?.description || '', Validators.required),
        });
    }

    /**
     * Loads the dropdown options for algorithms.
     */
    loadAlgorithms() {
        this.algorithmService.getAllAlgorithms().pipe(takeUntil(this.destroy$)).subscribe({
            next: algorithms => {
                this.algorithms = algorithms;
                if (this.isEditMode) {
                    this.setDropdownValues();
                }
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: this.translateService.instant('Error'),
                    detail: error.message
                });
            }
        });
    }

    /**
     * Sets the values for the dropdowns based on the selected implementation.
     */
    setDropdownValues() {
        if (this.selectedImplementation) {
            this.formGroup.patchValue({
                algorithm: this.algorithms.find(a => a.algorithmId === this.selectedImplementation.algorithmId) || null
            });
        }
    }

    /**
     * Navigates back to the learning process management page.
     */
    back() {
        this.router.navigate([`${LearningProcessManagementRoutingModule.route}`]);
    }

    /**
     * Saves the learning process and its implementation.
     */
    save() {
        const formValues = this.formGroup.value;

        // Prepare Implementation payload
        const implementationPayload = {
            software: formValues.software,
            name: formValues.name,
            algorithmId: formValues.algorithm.algorithmId
        };

        if (!this.selectedImplementation.implementationId) {
            // Create new Implementation
            const newImplementation: Implementation = new Implementation({ ...implementationPayload });
            this.implementationService.createImplementation(newImplementation)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: implementation => {
                        this.selectedImplementation = implementation;
                        this.saveLearningProcess(implementation.implementationId);
                    },
                    error: (error: any) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('Error'),
                            detail: error.message
                        });
                    }
                });
        } else {
            // Update existing Implementation
            const updatedImplementation: Implementation = new Implementation({ implementationId: this.selectedImplementation.implementationId, ...implementationPayload });
            this.implementationService.updateImplementation(updatedImplementation)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: implementation => {
                        this.selectedImplementation = implementation;
                        this.saveLearningProcess(implementation.implementationId);
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
    }

    /**
     * Saves the learning process after getting the implementation ID.
     * @param implementationId The ID of the related Implementation
     */
    saveLearningProcess(implementationId: number) {
        const formValues = this.formGroup.value;

        // Prepare Learning Process payload
        const learningProcessPayload = {
            description: formValues.description,
            implementationId: implementationId
        };

        if (!this.selectedLearningProcess.learningProcessId) {
            // Create new Learning Process
            const newLearningProcess: LearningProcess = new LearningProcess({ ...learningProcessPayload });
            this.learningProcessService.createLearningProcess(newLearningProcess)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: learningProcess => {
                        this.selectedLearningProcess = learningProcess;
                        this.messageService.add({
                            severity: 'success',
                            summary: this.translateService.instant('Success'),
                            detail: this.translateService.instant('LearningProcessManagement.LearningProcessCreated')
                        });
                        this.router.navigate([`${LearningProcessManagementRoutingModule.route}/${learningProcess.learningProcessId}`]);
                    },
                    error: (error: any) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: this.translateService.instant('Error'),
                            detail: error.message
                        });
                    }
                });
        } else {
            // Update existing Learning Process
            const updatedLearningProcess: LearningProcess = new LearningProcess({ learningProcessId: this.selectedLearningProcess.learningProcessId, ...learningProcessPayload });
            this.learningProcessService.updateLearningProcess(updatedLearningProcess)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: learningProcess => {
                        this.selectedLearningProcess = learningProcess;
                        this.messageService.add({
                            severity: 'success',
                            summary: this.translateService.instant('Success'),
                            detail: this.translateService.instant('LearningProcessManagement.LearningProcessUpdated')
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
    }
}
