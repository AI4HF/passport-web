/**
 * Model for Passport class
 */
export class Passport{
    /**
     * The ID of the Passport
     */
    passportId: number;

    /**
     * The ID of the Model Deployment
     */
    deploymentId: number;

    /**
     * The ID of the Study
     */
    studyId: number;

    /**
     * The creation date of the Passport
     */
    createdAt: Date;

    /**
     * The ID of the personnel that created the Passport
     */
    createdBy: string;

    /**
     * The approval date of the Passport
     */
    approvedAt: Date;

    /**
     * The ID of the personnel that approved the Passport
     */
    approvedBy: string;

    constructor(data: any) {

        if(!data){
            return;
        }

        this.passportId = data.passportId;
        this.deploymentId = data.deploymentId;
        this.studyId = data.studyId;
        this.createdAt = data.createdAt;
        this.createdBy = data.createdBy;
        this.approvedAt = data.approvedAt;
        this.approvedBy = data.approvedBy;
    }
}