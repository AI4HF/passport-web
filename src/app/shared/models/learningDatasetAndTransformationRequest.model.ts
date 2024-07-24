import { LearningDataset } from "./learningDataset.model";
import { DatasetTransformation } from "./datasetTransformation.model";

/**
 * Interface for the combined request containing both LearningDataset and DatasetTransformation.
 */
export interface LearningDatasetAndTransformationRequest {
    /**
     * The learning dataset to be created or updated.
     */
    learningDataset: LearningDataset;

    /**
     * The dataset transformation to be created or updated.
     */
    datasetTransformation: DatasetTransformation;
}
