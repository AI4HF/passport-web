import { Dataset } from "./dataset.model";
import { LearningDataset } from "./learningDataset.model";

/**
 * Model for Dataset with associated LearningDatasets.
 */
export class DatasetWithLearningDatasetsDTO {

    /**
     * The Dataset entity.
     */
    dataset: Dataset;

    /**
     * The list of LearningDatasets associated with the Dataset.
     */
    learningDatasets: LearningDataset[];

    constructor(data: any) {
        if (!data) {
            return;
        }

        this.dataset = new Dataset(data.dataset);
        this.learningDatasets = data.learningDatasets.map((learningDataset: any) => new LearningDataset(learningDataset));
    }
}
