import { Component, Injector, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from "../../../shared/components/base.component";
import { QualityAssessment } from "../../../shared/models/qualityAssessment.model";
import { QualityCriterionAssessmentResult } from "../../../shared/models/qualityCriterionAssessmentResult.model";

/**
 * Read-only view of the quality assessment runs over the active study's datasets. Runs recur, so
 * this is the longitudinal quality record of each dataset.
 */
@Component({
    selector: 'app-quality-assessment-table',
    templateUrl: './quality-assessment-table.component.html',
    styleUrls: ['./quality-assessment-table.component.scss']
})
export class QualityAssessmentTableComponent extends BaseComponent implements OnInit {
    /** The assessment runs of the active study */
    qualityAssessmentList: QualityAssessment[] = [];
    /** Results per run, loaded when a row is expanded */
    resultsByAssessmentId: { [qualityAssessmentId: string]: QualityCriterionAssessmentResult[] } = {};
    /** Rule names, so results can be labelled rather than shown as ids */
    criterionNameById: { [qualityCriterionId: string]: string } = {};
    /** Loading state of the table */
    loading: boolean = true;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        if (this.activeStudyService.getActiveStudy()) {
            this.loadQualityAssessments();
            this.loadCriterionNames();
        }
    }

    /**
     * Loads the assessment runs of the active study.
     */
    loadQualityAssessments() {
        this.qualityAssessmentService.getQualityAssessmentList(this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$)).subscribe({
            next: assessments => {
                this.qualityAssessmentList = assessments;
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
     * Loads the rule names of every criteria set in the study, so results read as names.
     */
    loadCriterionNames() {
        const studyId = this.activeStudyService.getActiveStudy();
        this.qualityCriteriaService.getQualityCriteriaList(studyId)
            .pipe(takeUntil(this.destroy$)).subscribe({
            next: criteriaList => {
                criteriaList.forEach(criteria => {
                    this.qualityCriterionService.getQualityCriterionList(criteria.qualityCriteriaId, studyId)
                        .pipe(takeUntil(this.destroy$)).subscribe({
                        next: criterion => {
                            criterion.forEach(c => this.criterionNameById[c.qualityCriterionId] = c.name);
                        }
                    });
                });
            }
        });
    }

    /**
     * Loads the results of a run the first time its row is expanded.
     * @param assessment The expanded assessment run
     */
    onRowExpand(assessment: QualityAssessment) {
        if (this.resultsByAssessmentId[assessment.qualityAssessmentId]) {
            return;
        }
        this.qualityCriterionAssessmentResultService
            .getResultsByAssessmentId(assessment.qualityAssessmentId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$)).subscribe({
            next: results => {
                this.resultsByAssessmentId[assessment.qualityAssessmentId] = results;
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
