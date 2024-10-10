/**
 * Model for Implementation class
 */
export class ImplementationWithSoftware {
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

        this.software = data.software;
        this.name = data.name;
        this.description = data.description;
    }
}