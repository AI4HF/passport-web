export class DatasetTransformationStep {
    stepId: number;
    dataTransformationId: number;
    inputFeatures: string;
    outputFeatures: string;
    method: string;
    explanation: string;
    createdAt: string;
    createdBy: number;
    lastUpdatedAt: string;
    lastUpdatedBy: number;

    constructor(data: any) {
        this.stepId = data.stepId;
        this.dataTransformationId = data.dataTransformationId;
        this.inputFeatures = data.inputFeatures;
        this.outputFeatures = data.outputFeatures;
        this.method = data.method;
        this.explanation = data.explanation;
        this.createdAt = data.createdAt;
        this.createdBy = data.createdBy;
        this.lastUpdatedAt = data.lastUpdatedAt;
        this.lastUpdatedBy = data.lastUpdatedBy;
    }
}
