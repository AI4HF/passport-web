import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../shared/components/base.component";
import { takeUntil } from "rxjs";
import { LearningProcess } from "../../../shared/models/learningProcess.model";
import { Table } from "primeng/table";
import { LearningProcessManagementRoutingModule } from "../learning-process-management-routing.module";

/**
 * Dashboard component for learningProcess management.
 */
@Component({
    selector: 'app-learning-process-management-dashboard',
    templateUrl: './learning-process-management-dashboard.component.html',
    styleUrls: ['./learning-process-management-dashboard.component.scss']
})
export class LearningProcessManagementDashboardComponent extends BaseComponent implements OnInit {

    /** List of learningProcesss */
    learningProcessList: LearningProcess[] = [];

    /** Columns to be displayed in the table */
    columns: any[];

    /** Loading state of the table */
    loading: boolean = true;

    /**
     * Constructor to inject dependencies.
     * @param injector The dependency injector
     */
    constructor(protected injector: Injector) {
        super(injector);

        this.columns = [
            { header: 'ID', field: 'learningProcessId' },
            { header: 'Description', field: 'description' }
        ];
    }

    /**
     * Initializes the component.
     */
    ngOnInit() {
        this.getLearningProcessList();
    }

    /**
     * Retrieves all learningProcesss from the server.
     */
    getLearningProcessList() {
        this.loading = true;
        this.learningProcessService.getAllLearningProcesses()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (learningProcessList: LearningProcess[]) => this.learningProcessList = learningProcessList,
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
     * Filters the table based on the input event.
     * @param table The table to be filtered
     * @param event The input event
     */
    filter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    /**
     * Navigates the user to the LearningProcess create page.
     */
    createLearningProcess() {
        this.router.navigate([`/${LearningProcessManagementRoutingModule.route}/new`]);
    }

    /**
     * Navigates the user to the LearningProcess edit page.
     * @param id The ID of the LearningProcess to be edited
     */
    editLearningProcess(id: number) {
        this.router.navigate([`/${LearningProcessManagementRoutingModule.route}/${id}`]);
    }

    /**
     * Deletes the implementation, which cascades to delete the associated learningProcess.
     * @param id The ID of the LearningProcess to be deleted
     */
    deleteLearningProcess(id: number) {
        this.loading = true;
        const learningProcess = this.learningProcessList.find(lp => lp.learningProcessId === id);

        if (learningProcess) {
            const implementationId = learningProcess.implementationId;

            this.implementationService.deleteImplementation(implementationId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.learningProcessList = this.learningProcessList.filter(lp => lp.learningProcessId !== id);

                        this.messageService.add({
                            severity: 'success',
                            summary: this.translateService.instant('Success'),
                            detail: this.translateService.instant('LearningProcessManagement.Deleted')
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
        } else {
            this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Error'),
                detail: this.translateService.instant('LearningProcessManagement.ProcessNotFound')
            });
            this.loading = false;
        }
    }
}
