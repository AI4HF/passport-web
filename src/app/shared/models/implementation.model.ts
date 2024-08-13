/**
 * Model for Implementation class
 */
export class Implementation {
    /**
     * The ID of the Implementation
     */
    implementationId: number;

    /**
     * The ID of the related Algorithm
     */
    algorithmId: number;

    /**
     * The software used in the Implementation
     */
    software: string;

    /**
     * The name of the Implementation
     */
    name: string;

    /**
     * The description of the Implementation
     */
    description: string;

    constructor(data: any) {
        if (!data) {
            return;
        }

        this.implementationId = data.implementationId;
        this.algorithmId = data.algorithmId;
        this.software = data.software;
        this.name = data.name;
        this.description = data.description;
    }
}
