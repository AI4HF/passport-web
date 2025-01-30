/**
 * Model for ModelParameter class
 */
export class ModelParameter {
    /**
     * The ID of the related Model
     */
    modelId: number;

    /**
     * The ID of the related Parameter
     */
    parameterId: number;

    /**
     * The type of the ModelParameter
     */
    type: string;

    /**
     * The value of the ModelParameter
     */
    value: string;

    constructor(data: any) {
        if (!data) {
            return;
        }

        this.modelId = data.modelId;
        this.parameterId = data.parameterId;
        this.type = data.type;
        this.value = data.value;
    }
}
