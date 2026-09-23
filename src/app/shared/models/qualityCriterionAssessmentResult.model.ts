/**
 * Model for QualityCriterionAssessmentResult class: one rule's outcome within an assessment run.
 */
export class QualityCriterionAssessmentResult {
    /**
     * The ID of the result
     */
    resultId: string;

    /**
     * The ID of the assessment run
     */
    qualityAssessmentId: string;

    /**
     * The ID of the criterion that produced it
     */
    qualityCriterionId: string;

    /**
     * The computed value
     */
    value: number;

    /**
     * The pass/fail outcome
     */
    result: string;

    /**
     * Any further detail about the outcome
     */
    detail: string;

    constructor(data: any) {
        if (!data) {
            return;
        }
        this.resultId = data.resultId;
        this.qualityAssessmentId = data.qualityAssessmentId;
        this.qualityCriterionId = data.qualityCriterionId;
        this.value = data.value;
        this.result = data.result;
        this.detail = data.detail;
    }
}
