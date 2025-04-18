/**
 * Model for EvaluationMeasure class
 */
export class EvaluationMeasure {

    /**
     * The ID of the EvaluationMeasure
     */
    measureId: string;
    
    /**
     * The ID of the related Model
     */
    modelId: string;
    
    /**
     * The name of the EvaluationMeasure
     */
    name: string;

    /**
     * The value of the EvaluationMeasure
     */
    value: string;
    
    /**
     * The data type of the EvaluationMeasure
     */
    dataType: string;

    /**
     * The description of the EvaluationMeasure
     */
    description: string;

    constructor(data: any) {
        if (!data) {
            return;
        }

        this.measureId = data.measureId;
        this.modelId = data.modelId;
        this.name = data.name;
        this.value = data.value;
        this.dataType = data.dataType;
        this.description = data.description;

    }
}
