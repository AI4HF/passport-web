import { ModelDeployment } from "./modelDeployment.model";

/**
 * Model representing a model deployment with an additional model name.
 */
export class ModelDeploymentWithModelName {
    /**
     * The deployment object.
     */
    modelDeployment: ModelDeployment;

    /**
     * The name of the model associated with this deployment.
     */
    modelName: string;

    constructor(modelDeployment: ModelDeployment, modelName: string) {
        if (!modelDeployment) {
            return;
        }
        this.modelDeployment = new ModelDeployment(modelDeployment);
        this.modelName = modelName || '';
    }
}
