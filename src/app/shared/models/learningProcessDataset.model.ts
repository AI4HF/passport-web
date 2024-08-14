/**
 * Model for LearningProcessDataset class
 */
export class LearningProcessDataset {
    /**
     * The ID of the related LearningProcess
     */
    learningProcessId: number;

    /**
     * The ID of the related LearningDataset
     */
    learningDatasetId: number;

    /**
     * The description of the LearningProcessDataset
     */
    description: string;

    constructor(data: any) {
        if (!data) {
            return;
        }

        this.learningProcessId = data.learningProcessId;
        this.learningDatasetId = data.learningDatasetId;
        this.description = data.description;
    }
}
