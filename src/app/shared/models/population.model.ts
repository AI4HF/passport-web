/**
 * Model for password Population class
 */
export class Population{
    /**
     * The ID of the Population
     */
    populationId: number;

    /**
     * The ID reference to the Study
     */
    studyId: number;

    /**
     * The url of the Population
     */
    populationUrl: string;

    /**
     * The description of the Population
     */
    description: string;

    /**
     * The characteristics of the Population
     */
    characteristics: string;

    constructor(data: any) {

        if(!data){
            return;
        }

        this.populationId = data.populationId;
        this.studyId = data.studyId;
        this.populationUrl = data.populationUrl;
        this.description = data.description;
        this.characteristics = data.characteristics;
    }
}