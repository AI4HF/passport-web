/**
 * Model for LearningStage class
 */
export class LearningStage {
    /**
     * The ID of the LearningStage
     */
    learningStageId: number;

    /**
     * The ID of the related LearningProcess
     */
    learningProcessId: number;

    /**
     * The name of the LearningStage
     */
    learningStageName: string;

    /**
     * The description of the LearningStage
     */
    description: string;

    /**
     * The percentage of the dataset used in this stage
     */
    datasetPercentage: number;

    constructor(data: any) {
        if (!data) {
            return;
        }

        this.learningStageId = data.learningStageId;
        this.learningProcessId = data.learningProcessId;
        this.learningStageName = data.learningStageName;
        this.description = data.description;
        this.datasetPercentage = data.datasetPercentage;
    }
}
