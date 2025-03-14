/**
 * Model for LearningStageParameter class
 */
export class LearningStageParameter {
    /**
     * The ID of the related LearningStage
     */
    learningStageId: string;

    /**
     * The ID of the related Parameter
     */
    parameterId: string;

    /**
     * The type of the LearningStageParameter
     */
    type: string;

    /**
     * The value of the LearningStageParameter
     */
    value: string;

    constructor(data: any) {
        if (!data) {
            return;
        }

        this.learningStageId = data.learningStageId;
        this.parameterId = data.parameterId;
        this.type = data.type;
        this.value = data.value;
    }
}
