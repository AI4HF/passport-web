/**
 * Model for QualityAssessment class: one execution of a criteria set over a Dataset.
 */
export class QualityAssessment {
    /**
     * The ID of the QualityAssessment
     */
    qualityAssessmentId: string;

    /**
     * The ID of the assessed Dataset
     */
    datasetId: string;

    /**
     * The ID of the criteria set that was run
     */
    qualityCriteriaId: string;

    /**
     * The overall outcome of the run
     */
    overallResult: string;

    /**
     * A summary of the run
     */
    summary: string;

    /**
     * When the run happened
     */
    executedAt: Date;

    /**
     * The personnel or software agent that ran it
     */
    executedBy: string;

    constructor(data: any) {
        if (!data) {
            return;
        }
        this.qualityAssessmentId = data.qualityAssessmentId;
        this.datasetId = data.datasetId;
        this.qualityCriteriaId = data.qualityCriteriaId;
        this.overallResult = data.overallResult;
        this.summary = data.summary;
        this.executedAt = data.executedAt;
        this.executedBy = data.executedBy;
    }
}
