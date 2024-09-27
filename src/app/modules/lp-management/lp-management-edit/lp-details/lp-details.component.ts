import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../shared/components/base.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs";
import { LearningProcess } from "../../../../shared/models/learningProcess.model";
import { Implementation } from "../../../../shared/models/implementation.model";
import { LpManagementRoutingModule } from "../../lp-management-routing.module";
import { Algorithm } from "../../../../shared/models/algorithm.model";
import { AlgorithmsWithType } from "../../../../shared/models/algorithmsWithType.model";
import { HttpClient } from '@angular/common/http';

/**
 * Component to display and manage the details of a learning process and its implementation.
 */
@Component({
    selector: 'app-learning-process-and-implementation-details',
    templateUrl: './lp-details.component.html',
    styleUrls: ['./lp-details.component.scss']
})
export class LpDetailsComponent extends BaseComponent implements OnInit {

    selectedLearningProcess: LearningProcess;
    selectedImplementation: Implementation;
    formGroup: FormGroup;
    groupedAlgorithms: AlgorithmsWithType[] = [];
    filteredAlgorithms: Algorithm[] = [];
    filteredSoftware: { software: string, name: string, description: string }[] = [];
    hardcodedSoftwareList: { software: string, name: string, description: string }[] = [];
    isEditMode: boolean = false;

    constructor(protected injector: Injector, private http: HttpClient) {
        super(injector);
    }

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
        this.loadHardcodedSoftware();
    }

    /**
     * Loads the predefined software list from a JSON file.
     */
    loadHardcodedSoftware() {
        this.http.get<{ software: string, name: string, description: string }[]>('assets/data/hardcoded-software.json').pipe(takeUntil(this.destroy$))
            .subscribe({
                next: data => this.hardcodedSoftwareList = data,
                error: err => console.error('Failed to load hardcoded software', err)
            });
    }

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

    initializeForm() {
        this.formGroup = new FormGroup({
            software: new FormControl(this.selectedImplementation?.software || '', Validators.required),
            name: new FormControl(this.selectedImplementation?.name || '', Validators.required),
            algorithm: new FormControl(this.selectedImplementation?.algorithmId || null, Validators.required),
            description: new FormControl(this.selectedLearningProcess?.description || '', Validators.required),
        });

        if (this.isEditMode && this.groupedAlgorithms.length > 0) {
            this.setDropdownValues();
        }
    }

    filterSoftware(event: any) {
        const query = event.query.toLowerCase();
        this.filteredSoftware = this.hardcodedSoftwareList.filter(software =>
            software.software.toLowerCase().includes(query)
        );
    }

    /**
     * Auto-fills only the software, name, and description fields from the selected software.
     * @param event The auto-complete select event
     */
    selectAutoFill(event: any) {
        const selectedSoftware = event.value;
        this.formGroup.patchValue({
            software: selectedSoftware.software,
            name: selectedSoftware.name,
            description: selectedSoftware.description
        });
    }

    loadAlgorithms() {
        this.algorithmService.getAllAlgorithms().pipe(takeUntil(this.destroy$)).subscribe({
            next: algorithms => {
                this.groupAlgorithmsByType(algorithms);
                this.filteredAlgorithms = algorithms;
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

    filterAlgorithms(event: any) {
        const query = event.query.toLowerCase();
        this.filteredAlgorithms = this.groupedAlgorithms
            .flatMap(group => group.algorithms)
            .filter(algorithm => algorithm.name.toLowerCase().includes(query));
    }

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

    save() {
        const formValues = this.formGroup.value;

        const implementationPayload = {
            software: formValues.software,
            name: formValues.name,
            algorithmId: formValues.algorithm?.algorithmId
        };

        const inputAlgorithmName = formValues.algorithm;
        if (typeof inputAlgorithmName === 'string') {
            const newAlgorithm = new Algorithm({
                name: inputAlgorithmName,
                type: 'Custom',
                subType: 'Custom',
                objectiveFunction: 'Custom'
            });

            this.algorithmService.createAlgorithm(newAlgorithm).pipe(takeUntil(this.destroy$)).subscribe({
                next: (createdAlgorithm: Algorithm) => {
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

    back() {
        this.router.navigate([`${LpManagementRoutingModule.route}`]);
    }
}
