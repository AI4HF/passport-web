import { LearningProcess } from "./learningProcess.model";
import { LearningStage } from "./learningStage.model";

/**
 * Model for LearningProcess with associated LearningStages.
 */
export class LearningProcessWithStagesDTO {

    /**
     * The LearningProcess entity.
     */
    learningProcess: LearningProcess;

    /**
     * The list of LearningStages associated with the LearningProcess.
     */
    learningStages: LearningStage[];

    constructor(data: any) {
        if (!data) {
            return;
        }

        this.learningProcess = new LearningProcess(data.learningProcess);
        this.learningStages = data.learningStages.map((learningStage: any) => new LearningStage(learningStage));
    }
}
