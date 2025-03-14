/**
 * Model for passport LearningDataset class
 */
export class LearningDataset {
    /**
     * The ID of the LearningDataset
     */
    learningDatasetId: string;

    /**
     * The ID of the associated Dataset
     */
    datasetId: string;

    /**
     * The ID of the associated study
     */
    studyId: string;

    /**
     * The ID of the associated DataTransformation
     */
    dataTransformationId: string;

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
        this.studyId = data.studyId;
        this.dataTransformationId = data.dataTransformationId;
        this.description = data.description;
    }
}

