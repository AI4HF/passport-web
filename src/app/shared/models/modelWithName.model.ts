import {Model} from "./model.model";

/**
 * Model representing a model with an ID and name.
 */
export class ModelWithName {
    /**
     * The ID of the model.
     */
    id: string;

    /**
     * The name of the model.
     */
    name: string;

    constructor(model: Model) {
        if (!model) {
            return;
        }
        this.id = model.modelId;
        this.name = model.name;
    }
}
