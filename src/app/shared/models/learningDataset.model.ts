/**
 * Model for passport LearningDataset class
 */
export class LearningDataset {
    /**
     * The ID of the LearningDataset
     */
    learningDatasetId: number;

    /**
     * The ID of the associated Dataset
     */
    datasetId: number;

    /**
     * The ID of the associated DataTransformation
     */
    dataTransformationId: number;

    /**
     * The description of the LearningDataset
     */
    description: string;

    constructor(data: any) {
        if (!data) {
            return;
        }
        this.learningDatasetId = data.learningDatasetId;
        this.datasetId = data.datasetId;
        this.dataTransformationId = data.dataTransformationId;
        this.description = data.description;
    }
}

