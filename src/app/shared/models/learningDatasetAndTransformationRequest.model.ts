import { LearningDataset } from "./learningDataset.model";
import { DatasetTransformation } from "./datasetTransformation.model";

/**
 * Class for the combined request containing both LearningDataset and DatasetTransformation.
 */
export class LearningDatasetAndTransformationRequest {
    /**
     * The learning dataset to be created or updated.
     */
    learningDataset: LearningDataset;

    /**
     * The dataset transformation to be created or updated.
     */
    datasetTransformation: DatasetTransformation;

    constructor(data: any) {
        if (!data) {
            return;
        }
        this.learningDataset = new LearningDataset(data.learningDataset);
        this.datasetTransformation = new DatasetTransformation(data.datasetTransformation);
    }
}
