import {LearningProcessDataset} from "./learningProcessDataset.model";

/**
 * Model representing a learning process dataset with an additional description.
 */
export class LearningProcessDatasetWithDescriptionModel {

    /**
     * The LearningProcessDataset object.
     */
    learningProcessDataset: LearningProcessDataset;

    /**
     * The Learning Dataset's description associated with the Learning Process Dataset object.
     */
    learningDatasetDescription: string;

    /**
     * Description of the Learning Process Dataset object.
     */
    description: string;

    constructor(learningProcessDataset: LearningProcessDataset, learningDatasetDescription: string, description: string) {
        if (!learningProcessDataset) {
            return;
        }
        this.learningProcessDataset = new LearningProcessDataset(learningProcessDataset);
        this.learningDatasetDescription = learningDatasetDescription;
        this.description = description;
    }
}
