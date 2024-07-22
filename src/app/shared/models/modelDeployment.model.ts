/**
 * Model for ModelDeployment class
 */
export class ModelDeployment{
    /**
     * The ID of the ModelDeployment
     */
    deploymentId: number;

    /**
     * The ID of the Model
     */
    modelId: number;

    /**
     * The ID of the DeploymentEnvironment
     */
    environmentId: number;

    /**
     * Tags of the ModelDeployment
     */
    tags: string;

    /**
     * IdentifiedFailures of the ModelDeployment
     */
    identifiedFailures: string;

    /**
     * The status of the ModelDeployment
     */
    status: string;

    /**
     * The creation date of the ModelDeployment
     */
    createdAt: Date;

    /**
     * The ID of the personnel that created the ModelDeployment
     */
    createdBy: number;

    /**
     * The latest update date of the ModelDeployment
     */
    lastUpdatedAt: Date;

    /**
     * The ID of the personnel that updated the ModelDeployment last
     */
    lastUpdatedBy: number;

    constructor(data: any) {

        if(!data){
            return;
        }

        this.deploymentId = data.deploymentId;
        this.modelId = data.modelId;
        this.environmentId = data.environmentId;
        this.tags = data.tags;
        this.identifiedFailures = data.identifiedFailures;
        this.status = data.status;
        this.createdAt = data.createdAt;
        this.createdBy = data.createdBy;
        this.lastUpdatedAt = data.lastUpdatedAt;
        this.lastUpdatedBy = data.lastUpdatedBy;
    }
}