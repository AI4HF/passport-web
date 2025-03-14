/**
 * Model for LearningProcessParameter class
 */
export class LearningProcessParameter {
    /**
     * The ID of the related LearningProcess
     */
    learningProcessId: string;

    /**
     * The ID of the related Parameter
     */
    parameterId: string;

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
