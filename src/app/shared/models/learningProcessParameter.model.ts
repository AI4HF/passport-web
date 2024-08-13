/**
 * Model for LearningProcessParameter class
 */
export class LearningProcessParameter {
    /**
     * The ID of the related LearningProcess
     */
    learningProcessId: number;

    /**
     * The ID of the related Parameter
     */
    parameterId: number;

    /**
     * The type of the LearningProcessParameter
     */
    type: string;

    /**
     * The value of the LearningProcessParameter
     */
    value: string;

    constructor(data: any) {
        if (!data) {
            return;
        }

        this.learningProcessId = data.learningProcessId;
        this.parameterId = data.parameterId;
        this.type = data.type;
        this.value = data.value;
    }
}
