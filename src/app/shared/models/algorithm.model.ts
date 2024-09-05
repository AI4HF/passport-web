/**
 * Model for Algorithm class
 */
export class Algorithm {
    /**
     * The ID of the Algorithm
     */
    algorithmId: number;

    /**
     * The name of the Algorithm
     */
    name: string;

    /**
     * The objective function of the Algorithm
     */
    objectiveFunction: string;

    /**
     * The type of the Algorithm
     */
    type: string;

    /**
     * The sub-type of the Algorithm
     */
    subType: string;

    constructor(data: any) {
        if (!data) {
            return;
        }

        this.algorithmId = data.algorithmId;
        this.name = data.name;
        this.objectiveFunction = data.objectiveFunction;
        this.type = data.type;
        this.subType = data.subType;
    }
}
