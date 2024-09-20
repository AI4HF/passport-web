import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs";
import { LearningProcess } from "../../../../shared/models/learningProcess.model";
import { Implementation } from "../../../../shared/models/implementation.model";
import { LpManagementRoutingModule } from "../../lp-management-routing.module";
import { Algorithm } from "../../../../shared/models/algorithm.model";
import { AlgorithmsWithType } from "../../../../shared/models/algorithmsWithType.model";

/**
 * Component to display and manage the details of a learning process and its implementation.
 */
@Component({
    selector: 'app-learning-process-and-implementation-details',
    templateUrl: './lp-details.component.html',
    styleUrls: ['./lp-details.component.scss']
})
export class LpDetailsComponent extends BaseComponent implements OnInit {

    /** The currently selected learning process */
    selectedLearningProcess: LearningProcess;

    /** The currently selected implementation */
    selectedImplementation: Implementation;

    /** The form group for the learning process and implementation */
    formGroup: FormGroup;

    /** Grouped algorithms by type */
    groupedAlgorithms: AlgorithmsWithType[] = [];

    /** Filtered list of algorithms for autocomplete */
    filteredAlgorithms: Algorithm[] = [];

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
                this.selectedLearningProcess = new LearningProcess({ learningProcessId: 0 });
                this.selectedImplementation = new Implementation({ implementationId: 0 });
                this.initializeForm();
            }
        });
        this.loadAlgorithms();
    }

    /**
     * Loads the Learning Process and its Implementation details by Learning Process ID if the entity is being edited.
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

        // Set the selected algorithm if in edit mode
        if (this.isEditMode && this.groupedAlgorithms.length > 0) {
            this.setDropdownValues();
        }
    }

    /**
     * Loads the dropdown options for algorithms and groups them by type.
     */
    loadAlgorithms() {
        this.algorithmService.getAllAlgorithms().pipe(takeUntil(this.destroy$)).subscribe({
            next: algorithms => {
                this.groupAlgorithmsByType(algorithms);
                this.filteredAlgorithms = algorithms; // Initialize the filtered list
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
     * Groups the algorithms by their type attribute.
     * @param algorithms List of all algorithms
     */
    groupAlgorithmsByType(algorithms: Algorithm[]) {
        const grouped = algorithms.reduce((acc, algorithm) => {
            const typeGroup = acc.find(group => group.type === algorithm.type);
            if (typeGroup) {
                typeGroup.algorithms.push(algorithm);
            } else {
                acc.push({ type: algorithm.type, algorithms: [algorithm] });
            }
            return acc;
        }, []);

        this.groupedAlgorithms = grouped;
    }

    /**
     * Filters the list of algorithms based on user input.
     */
    filterAlgorithms(event: any) {
        const query = event.query.toLowerCase();
        this.filteredAlgorithms = this.groupedAlgorithms
            .flatMap(group => group.algorithms)
            .filter(algorithm => algorithm.name.toLowerCase().includes(query));
    }

    /**
     * Sets the values for the dropdowns based on the selected implementation.
     */
    setDropdownValues() {
        if (this.selectedImplementation) {
            const selectedAlgorithm = this.groupedAlgorithms
                .flatMap(group => group.algorithms)
                .find(a => a.algorithmId === this.selectedImplementation.algorithmId);
            this.formGroup.patchValue({
                algorithm: selectedAlgorithm || null
            });
        }
    }

    /**
     * Navigates back to the learning process management page.
     */
    back() {
        this.router.navigate([`${LpManagementRoutingModule.route}`]);
    }

    /**
     * Saves the learning process and its implementation.
     */
    save() {
        const formValues = this.formGroup.value;

        const implementationPayload = {
            software: formValues.software,
            name: formValues.name,
            algorithmId: formValues.algorithm?.algorithmId // Will be updated after custom algorithm creation
        };

        // Check if a custom algorithm needs to be created
        const inputAlgorithmName = formValues.algorithm;
        if (typeof inputAlgorithmName === 'string') {
            // Create a new algorithm with the entered name
            const newAlgorithm = new Algorithm({
                name: inputAlgorithmName,
                type: 'Custom',
                subType: 'Custom',
                objectiveFunction: 'Custom' // Adjust as needed
            });

            // Create the custom algorithm and update the form after it is created
            this.algorithmService.createAlgorithm(newAlgorithm).pipe(takeUntil(this.destroy$)).subscribe({
                next: (createdAlgorithm: Algorithm) => {
                    // Set the form control to the newly created algorithm
                    formValues.algorithm = createdAlgorithm;
                    this.saveFormWithCreatedAlgorithm(formValues, implementationPayload);
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                }
            });
        } else {
            this.saveFormWithCreatedAlgorithm(formValues, implementationPayload);
        }
    }

    saveFormWithCreatedAlgorithm(formValues: any, implementationPayload: any) {
        if (!this.selectedImplementation.implementationId) {
            const newImplementation: Implementation = new Implementation({ ...implementationPayload, algorithmId: formValues.algorithm.algorithmId });
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
            const updatedImplementation: Implementation = new Implementation({ implementationId: this.selectedImplementation.implementationId, ...implementationPayload, algorithmId: formValues.algorithm.algorithmId });
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

        const learningProcessPayload = {
            description: formValues.description,
            implementationId: implementationId
        };

        if (!this.selectedLearningProcess.learningProcessId) {
            const newLearningProcess: LearningProcess = new LearningProcess({ studyId: this.activeStudyService.getActiveStudy().id, ...learningProcessPayload });
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
                        this.router.navigate([`${LpManagementRoutingModule.route}/${learningProcess.learningProcessId}/learning-process-dataset-assignment`]);
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
                        this.router.navigate([`${LpManagementRoutingModule.route}/${learningProcess.learningProcessId}/learning-process-dataset-assignment`]);
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
