/**
 * Model for passport DatasetTransformationStep class
 */
export class DatasetTransformationStep {
    /**
     * The ID of the DatasetTransformationStep
     */
    stepId: number;

    /**
     * The ID of the associated DatasetTransformation
     */
    dataTransformationId: number;

    /**
     * The input features for the transformation step
     */
    inputFeatures: string;

    /**
     * The output features for the transformation step
     */
    outputFeatures: string;

    /**
     * The method used in the transformation step
     */
    method: string;

    /**
     * The explanation of the transformation step
     */
    explanation: string;

    /**
     * The creation timestamp of the transformation step
     */
    createdAt: string;

    /**
     * The ID of the user who created the transformation step
     */
    createdBy: number;

    /**
     * The last update timestamp of the transformation step
     */
    lastUpdatedAt: string;

    /**
     * The ID of the user who last updated the transformation step
     */
    lastUpdatedBy: number;

    constructor(data: any) {
        if (!data) {
            return;
        }
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

