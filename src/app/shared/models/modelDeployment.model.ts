/**
 * Model for ModelDeployment class
 */
export class ModelDeployment{
    /**
     * The ID of the ModelDeployment
     */
    deploymentId: string;

    /**
     * The ID of the Model
     */
    modelId: string;

    /**
     * The ID of the DeploymentEnvironment
     */
    environmentId: string;

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
    createdBy: string;

    /**
     * The latest update date of the ModelDeployment
     */
    lastUpdatedAt: Date;

    /**
     * The ID of the personnel that updated the ModelDeployment last
     */
    lastUpdatedBy: string;

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