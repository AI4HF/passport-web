import { Component, Injector, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from "../../../shared/components/base.component";
import { QualityCriteria } from "../../../shared/models/qualityCriteria.model";
import { QualityCriterion } from "../../../shared/models/qualityCriterion.model";

/**
 * Read-only view of the quality criteria sets defined for the active study. The sets and their
 * rules are synced from the declarative definitions, so they are reviewed here rather than typed.
 */
@Component({
    selector: 'app-quality-criteria-table',
    templateUrl: './quality-criteria-table.component.html',
    styleUrls: ['./quality-criteria-table.component.scss']
})
export class QualityCriteriaTableComponent extends BaseComponent implements OnInit {
    /** The criteria sets of the active study */
    qualityCriteriaList: QualityCriteria[] = [];
    /** Rules per criteria set, loaded when a row is expanded */
    criterionByCriteriaId: { [qualityCriteriaId: string]: QualityCriterion[] } = {};
    /** Loading state of the table */
    loading: boolean = true;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        if (this.activeStudyService.getActiveStudy()) {
            this.loadQualityCriteria();
        }
    }

    /**
     * Loads the criteria sets of the active study.
     */
    loadQualityCriteria() {
        this.qualityCriteriaService.getQualityCriteriaList(this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$)).subscribe({
            next: criteria => {
                this.qualityCriteriaList = criteria;
            },
            error: (error) => {
                this.loading = false;
                this.translateService.get('Error').subscribe(translation => {
                    this.messageService.add({
                        severity: 'error',
                        summary: translation,
                        detail: error.message
                    });
                });
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    /**
     * Loads the rules of a criteria set the first time its row is expanded.
     * @param qualityCriteria The expanded criteria set
     */
    onRowExpand(qualityCriteria: QualityCriteria) {
        if (this.criterionByCriteriaId[qualityCriteria.qualityCriteriaId]) {
            return;
        }
        this.qualityCriterionService
            .getQualityCriterionList(qualityCriteria.qualityCriteriaId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$)).subscribe({
            next: criterion => {
                this.criterionByCriteriaId[qualityCriteria.qualityCriteriaId] = criterion;
            },
            error: (error) => {
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
     * Filters the table globally based on the input event.
     * @param table The table to be filtered
     * @param event The input event
     */
    filter(table: any, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
