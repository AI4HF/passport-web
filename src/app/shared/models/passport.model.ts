/**
 * Model for Passport class
 */
export class Passport{
    /**
     * The ID of the Passport
     */
    passportId: string;

    /**
     * The ID of the Model
     */
    modelId: string;

    /**
     * The ID of the Study
     */
    studyId: string;

    /**
     * The version of the Passport. Regenerating chains a new version onto the previous one.
     */
    version: number;

    /**
     * The ID of the Passport version this one was regenerated from
     */
    previousPassportId: string;

    /**
     * SHA-256 of the signed PDF, present once the Passport has been generated
     */
    signedPdfHash: string;

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
        this.modelId = data.modelId;
        this.studyId = data.studyId;
        this.version = data.version;
        this.previousPassportId = data.previousPassportId;
        this.signedPdfHash = data.signedPdfHash;
        this.createdAt = data.createdAt;
        this.createdBy = data.createdBy;
        this.approvedAt = data.approvedAt;
        this.approvedBy = data.approvedBy;
    }
}
