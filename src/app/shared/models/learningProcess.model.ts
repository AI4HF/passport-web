/**
 * Model for LearningProcess class
 */
export class LearningProcess {
    /**
     * The ID of the LearningProcess
     */
    learningProcessId: number;

    /**
     * The ID of the study
     */
    studyId: number;

    /**
     * The ID of the related Implementation
     */
    implementationId: number;

    /**
     * The description of the LearningProcess
     */
    description: string;

    constructor(data: any) {
        if (!data) {
            return;
        }

        this.learningProcessId = data.learningProcessId;
        this.studyId = data.studyId;
        this.implementationId = data.implementationId;
        this.description = data.description;
    }
}
