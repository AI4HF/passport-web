/**
 * Model for password Population class
 */
export class Population{
    /**
     * The ID of the Population
     */
    populationId: string;

    /**
     * The ID reference to the Study
     */
    studyId: string;

    /**
     * The url of the Population
     */
    populationUrl: string;

    /**
     * The version of the declarative cohort definition
     */
    version: string;

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
        this.version = data.version;
        this.description = data.description;
        this.characteristics = data.characteristics;
    }
}