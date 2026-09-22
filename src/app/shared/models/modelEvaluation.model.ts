/**
 * Model for ModelEvaluation class
 */
export class ModelEvaluation {
    /**
     * The ID of the ModelEvaluation
     */
    modelEvaluationId: string;

    /**
     * The ID of the evaluated Model
     */
    modelId: string;

    /**
     * The Organization the run is attributable to. Training runs are aggregated across the federation
     * and leave this empty; a monitoring import sets it.
     */
    organizationId: string;

    /**
     * What caused the run, e.g. training or monitoring
     */
    trigger: string;

    /**
     * How the per-node results were aggregated
     */
    aggregationMethod: string;

    /**
     * When the run was executed
     */
    executedAt: Date;

    /**
     * Who executed the run
     */
    executedBy: string;

    /**
     * The description of the run
     */
    description: string;

    constructor(data: any) {
        if (!data) {
            return;
        }

        this.modelEvaluationId = data.modelEvaluationId;
        this.modelId = data.modelId;
        this.organizationId = data.organizationId;
        this.trigger = data.trigger;
        this.aggregationMethod = data.aggregationMethod;
        this.executedAt = data.executedAt ? new Date(data.executedAt) : null;
        this.executedBy = data.executedBy;
        this.description = data.description;
    }
}
