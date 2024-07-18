export class LearningDataset {
    learningDatasetId: number;
    datasetId: number;
    dataTransformationId: number;
    description: string;

    constructor(data: any) {
        this.learningDatasetId = data.learningDatasetId;
        this.datasetId = data.datasetId;
        this.dataTransformationId = data.dataTransformationId;
        this.description = data.description;
    }
}
