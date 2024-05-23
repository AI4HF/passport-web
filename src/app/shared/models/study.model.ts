/**
 * Model for password Study class
 */
export class Study{
    /**
     * The ID of the Study
     */
    id: number;

    /**
     * The name of the Study
     */
    name: string;

    /**
     * The description of the Study
     */
    description: string;

    /**
     * The objectives of the Study
     */
    objectives: string;

    /**
     * The ethics of the Study
     */
    ethics: string;

    constructor(data: any) {

        if(!data){
            return;
        }

        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.objectives = data.objectives;
        this.ethics = data.ethics;
    }
}